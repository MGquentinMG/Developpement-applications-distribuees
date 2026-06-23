vault status | grep "Initialized" | grep "true"
if [ $? -ne 0 ]; then
    vault operator init ...
else
    echo "Vault already initialized, skipping init"
fi

INIT_OUTPUT=$(vault operator init -key-shares=1 -key-threshold=1 -format=json)
echo "$INIT_OUTPUT" > /vault/init_output.json

UNSEAL_KEY=$(echo "$INIT_OUTPUT" | awk -F'"' '/"unseal_keys_b64"/{getline; print $2}')
ROOT_TOKEN=$(echo "$INIT_OUTPUT" | awk -F'"' '/"root_token"/{print $4}')

echo "DEBUG UNSEAL_KEY: $UNSEAL_KEY"
echo "DEBUG ROOT_TOKEN: $ROOT_TOKEN"

vault operator unseal "$UNSEAL_KEY"
export VAULT_TOKEN="$ROOT_TOKEN"

echo "UNSEAL_KEY=$UNSEAL_KEY" > /vault/keys.env
echo "ROOT_TOKEN=$ROOT_TOKEN" >> /vault/keys.env

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

echo "APP_VAULT_ROLE_ID=$ROLE_ID" >> /vault/keys.env
echo "APP_VAULT_SECRET_ID=$SECRET_ID" >> /vault/keys.env

echo "==> Init termine. Credentials dans /vault/keys.env"