const VAULT_ADDR = process.env.VAULT_ADDR;
const VAULT_TOKEN = process.env.VAULT_TOKEN;
const VAULT_ROLE_ID = process.env.VAULT_ROLE_ID;
const VAULT_SECRET_ID = process.env.VAULT_SECRET_ID;

let vaultToken = VAULT_TOKEN || null;

async function authenticate() {
  if (VAULT_TOKEN) {
    vaultToken = VAULT_TOKEN;
    return;
  }

  const res = await fetch(`${VAULT_ADDR}/v1/auth/approle/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role_id: roleId, secret_id: secretId }),
  });

  if (!res.ok) {
    throw new Error(`Impossible de s'authentifier à Vault via AppRole: ${res.statusText}`);
  }

  const data = await res.json();
  vaultToken = data.auth.client_token;
}

async function getToken(forceRefresh = false) {
  if (!vaultToken || forceRefresh) {
    await authenticate();
  }
  return vaultToken;
}

async function getPublicKey(retries = 15, delayMs = 2000) {
  for (let i = 0; i < retries; i++) {
    const token = await getToken();
    const res = await fetch(`${VAULT_ADDR}/v1/transit/keys/jwt-key`, {
      headers: { "X-Vault-Token": token }
    });

    if (res.ok) {
      const data = await res.json();
      if (data.data?.keys?.["1"]?.public_key) {
        return data.data.keys["1"].public_key;
      }
    }

    const remaining = retries - 1 - i;
    if (remaining > 0) {
      console.log(`Vault pas encore prêt (tentative ${i + 1}/${retries}), nouvelle tentative dans ${delayMs}ms...`);
      await new Promise(r => setTimeout(r, delayMs));
    }
  }
  throw new Error(`Impossible de récupérer la clé publique depuis Vault après ${retries} tentatives`);
}

async function signWithVault(payload, retry = true) {
  const token = await getToken(!retry);

  const header = Buffer.from(JSON.stringify({ alg: "ES256", typ: "JWT" })).toString("base64url");
  const now = Math.floor(Date.now() / 1000);
  const fullPayload = { ...payload, iat: now, exp: now + 7 * 24 * 3600 };
  const body = Buffer.from(JSON.stringify(fullPayload)).toString("base64url");
  const signingInput = `${header}.${body}`;

  const res = await fetch(`${VAULT_ADDR}/v1/transit/sign/jwt-key`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Vault-Token": token },
    body: JSON.stringify({
      input: Buffer.from(signingInput).toString("base64"),
      marshaling_algorithm: "jws",
      hash_algorithm: "sha2-256",
    }),
  });

  if (res.status === 403 || res.status === 400) {
    const errorData = await res.json();
    const isTokenError = errorData.errors?.some(e => e.includes("permission denied") || e.includes("invalid token"));

    if (isTokenError && retry) {
      vaultToken = null;
      return signWithVault(payload, false);
    }

    throw new Error(`Vault sign error: ${JSON.stringify(errorData)}`);
  }

  const data = await res.json();
  const signature = data.data.signature.replace("vault:v1:", "");
  return `${signingInput}.${signature}`;
}

module.exports = { getPublicKey, signWithVault };
