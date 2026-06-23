#!/bin/sh
set -e

echo "==> Checking Vault status..."

IS_INITIALIZED=$(vault status -format=json 2>/dev/null | grep '"initialized"' | grep 'true' || true)

if [ -z "$IS_INITIALIZED" ]; then
  echo "==> Vault not initialized. Running init..."

  INIT_OUTPUT=$(vault operator init -key-shares=1 -key-threshold=1 -format=json)
  echo "$INIT_OUTPUT" > /vault/init_output.json

  # Vault 1.17 sort du JSON multi-ligne → on utilise sed pour parser ligne par ligne
  UNSEAL_KEY=$(echo "$INIT_OUTPUT" | sed -n '/"unseal_keys_b64"/{n;p}' | tr -d ' [],"')
  ROOT_TOKEN=$(echo "$INIT_OUTPUT" | grep '"root_token"' | sed 's/.*"root_token": *"\([^"]*\)".*/\1/')

  if [ -z "$UNSEAL_KEY" ] || [ -z "$ROOT_TOKEN" ]; then
    echo "==> ERROR: impossible d'extraire UNSEAL_KEY ou ROOT_TOKEN du JSON." >&2
    echo "==> Contenu du JSON:" >&2
    cat /vault/init_output.json >&2
    exit 1
  fi

  echo "==> Unsealing..."
  vault operator unseal "$UNSEAL_KEY"
  export VAULT_TOKEN="$ROOT_TOKEN"

  # Sauvegarder les credentials pour les redémarrages
  printf 'UNSEAL_KEY=%s\nROOT_TOKEN=%s\n' "$UNSEAL_KEY" "$ROOT_TOKEN" > /vault/keys.env

  echo "==> Enabling secrets engines and auth..."
  vault auth enable approle
  vault secrets enable transit
  vault secrets enable -path=secret kv-v2

  vault write -f transit/keys/jwt-key type=ecdsa-p256

  vault policy write breezy-policy - <<EOF
path "transit/sign/jwt-key"   { capabilities = ["create","update"] }
path "transit/verify/jwt-key" { capabilities = ["create","update"] }
path "transit/keys/jwt-key"   { capabilities = ["read"] }
path "secret/data/breezy/*"   { capabilities = ["read"] }
EOF

  vault write auth/approle/role/breezy-app \
    token_policies="breezy-policy" \
    token_ttl=1h \
    token_max_ttl=4h

  ROLE_ID=$(vault read -field=role_id auth/approle/role/breezy-app/role-id)
  SECRET_ID=$(vault write -f -field=secret_id auth/approle/role/breezy-app/secret-id)

  printf 'APP_VAULT_ROLE_ID=%s\nAPP_VAULT_SECRET_ID=%s\n' "$ROLE_ID" "$SECRET_ID" >> /vault/keys.env

  echo "==> Init termine. Credentials dans /vault/keys.env"

else
  echo "==> Vault already initialized. Unsealing if needed..."

  IS_SEALED=$(vault status -format=json 2>/dev/null | grep '"sealed"' | grep 'true' || true)

  if [ -n "$IS_SEALED" ]; then
    if [ -f /vault/keys.env ]; then
      UNSEAL_KEY=$(grep "^UNSEAL_KEY=" /vault/keys.env | cut -d'=' -f2 | tr -d '\r\n')
      if [ -z "$UNSEAL_KEY" ]; then
        echo "==> ERROR: UNSEAL_KEY vide dans keys.env." >&2
        exit 1
      fi
      vault operator unseal "$UNSEAL_KEY"
      echo "==> Vault unsealed."
    else
      echo "==> ERROR: keys.env introuvable." >&2
      exit 1
    fi
  else
    echo "==> Vault already unsealed."
  fi
fi
