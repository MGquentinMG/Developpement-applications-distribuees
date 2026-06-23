const fs = require("fs");

const VAULT_ADDR = process.env.VAULT_ADDR || "http://localhost:8200";

let cachedToken = null;
let tokenExpiry = 0;

// Lit les credentials depuis /vault/keys.env (bind-monté par Docker depuis backend/vault/)
function readKeysFile() {
  try {
    const content = fs.readFileSync("/vault/keys.env", "utf8");
    // tr -d '\r' pour gérer les fichiers écrits sur Windows
    const roleId = content.match(/APP_VAULT_ROLE_ID=([^\r\n]+)/)?.[1]?.trim();
    const secretId = content.match(/APP_VAULT_SECRET_ID=([^\r\n]+)/)?.[1]?.trim();
    return { roleId, secretId };
  } catch {
    return {};
  }
}

async function getVaultToken(forceRefresh = false) {
  if (!forceRefresh && cachedToken && Date.now() < tokenExpiry) return cachedToken;

  // /vault/keys.env en priorité (toujours à jour après init), puis env vars en fallback
  let roleId, secretId;
  const fromFile = readKeysFile();
  if (fromFile.roleId && fromFile.secretId) {
    roleId = fromFile.roleId;
    secretId = fromFile.secretId;
  } else {
    roleId = process.env.APP_VAULT_ROLE_ID || process.env.VAULT_ROLE_ID;
    secretId = process.env.APP_VAULT_SECRET_ID || process.env.VAULT_SECRET_ID;
  }

  if (!roleId || !secretId) throw new Error("No Vault AppRole credentials");

  const res = await fetch(`${VAULT_ADDR}/v1/auth/approle/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role_id: roleId, secret_id: secretId }),
  });

  if (!res.ok) throw new Error(`Vault AppRole auth failed: ${res.statusText}`);

  const data = await res.json();
  cachedToken = data.auth.client_token;
  tokenExpiry = Date.now() + (data.auth.lease_duration - 60) * 1000;
  return cachedToken;
}

async function getPublicKey() {
  try {
    const token = await getVaultToken();
    const res = await fetch(`${VAULT_ADDR}/v1/transit/keys/jwt-key`, {
      headers: { "X-Vault-Token": token },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const latest = String(data.data.latest_version);
    return data.data.keys[latest].public_key;
  } catch {
    return null; // Vault indisponible → fallback JWT_SECRET
  }
}

async function signWithVault(payload, retry = true) {
  const token = await getVaultToken(!retry);

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

  if ((res.status === 403 || res.status === 400) && retry) {
    cachedToken = null;
    return signWithVault(payload, false);
  }

  if (!res.ok) throw new Error(`Vault sign failed: ${res.statusText}`);

  const data = await res.json();
  const signature = data.data.signature.replace("vault:v1:", "");
  return `${signingInput}.${signature}`;
}

module.exports = { getPublicKey, signWithVault };
