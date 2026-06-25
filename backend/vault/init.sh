#!/bin/sh

export VAULT_ADDR="${VAULT_ADDR:-http://vault:8200}"
export VAULT_TOKEN="${VAULT_TOKEN:-breezy_dev_root}"

echo "==> VAULT_ADDR=$VAULT_ADDR"
echo "==> Attente de Vault (max 60s)..."
i=1
while [ $i -le 30 ]; do
  vault status 2>/dev/null && break
  echo "  [${i}/30] pas encore pret, retry dans 2s..."
  sleep 2
  i=$((i + 1))
done

vault status || { echo "==> ERREUR: Vault inaccessible apres 60s"; exit 1; }

echo "==> Activation approle..."
vault auth enable approle 2>&1 || echo "  (deja actif)"

echo "==> Activation transit..."
vault secrets enable transit 2>&1 || echo "  (deja actif)"

echo "==> Activation kv-v2..."
vault secrets enable -path=secret kv-v2 2>&1 || echo "  (deja actif)"

echo "==> Creation de la cle transit JWT..."
vault write -f transit/keys/jwt-key type=ecdsa-p256 2>&1 || echo "  (deja existant)"

echo "==> Ecriture de la policy..."
printf 'path "transit/sign/jwt-key"   { capabilities = ["create","update"] }\npath "transit/verify/jwt-key" { capabilities = ["create","update"] }\npath "transit/keys/jwt-key"   { capabilities = ["read"] }\npath "secret/data/breezy/*"   { capabilities = ["read"] }\n' > /tmp/policy.hcl
vault policy write breezy-policy /tmp/policy.hcl

echo "==> Creation du role AppRole..."
vault write auth/approle/role/breezy-app \
  token_policies="breezy-policy" \
  token_ttl=1h \
  token_max_ttl=4h

echo "==> Recuperation des credentials..."
ROLE_ID=$(vault read -field=role_id auth/approle/role/breezy-app/role-id)
SECRET_ID=$(vault write -f -field=secret_id auth/approle/role/breezy-app/secret-id)

printf 'APP_VAULT_ROLE_ID=%s\nAPP_VAULT_SECRET_ID=%s\n' "$ROLE_ID" "$SECRET_ID" > /vault/keys.env

echo "==> Done. ROLE_ID=$ROLE_ID"