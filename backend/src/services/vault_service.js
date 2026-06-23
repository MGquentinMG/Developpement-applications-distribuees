const VAULT_ADDR = process.env.VAULT_ADDR;
const VAULT_ROLE_ID = process.env.VAULT_ROLE_ID;
const VAULT_SECRET_ID = process.env.VAULT_SECRET_ID;

let vaultToken = null;

async function authenticate() {
  const res = await fetch(`${VAULT_ADDR}/v1/auth/approle/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role_id: VAULT_ROLE_ID, secret_id: VAULT_SECRET_ID })
  });
  
  if (!res.ok) {
    throw new Error(`Impossible de s'authentifier à Vault via AppRole: ${res.statusText}`);
  }

  const data = await res.json();
  vaultToken = data.auth.client_token;
}

// Force l'authentification si le token est manquant ou si on sait qu'il a expiré
async function getToken(forceRefresh = false) {
  if (!vaultToken || forceRefresh) {
    await authenticate();
  }
  return vaultToken;
}

async function getPublicKey() {
  const token = await getToken();
  const res = await fetch(`${VAULT_ADDR}/v1/transit/keys/jwt-key`, {
    headers: { "X-Vault-Token": token }
  });
  const data = await res.json();
  return data.data.keys["1"].public_key;
}

async function signWithVault(payload, retry = true) {
  // Si c'est un retry, on force la génération d'un nouveau token
  const token = await getToken(!retry); 

  const header = Buffer.from(JSON.stringify({ alg: "ES256", typ: "JWT" })).toString("base64url");
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signingInput = `${header}.${body}`;

  const res = await fetch(`${VAULT_ADDR}/v1/transit/sign/jwt-key`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Vault-Token": token },
    body: JSON.stringify({
      input: Buffer.from(signingInput).toString("base64"),
      marshaling_algorithm: "jws",
      hash_algorithm: "sha2-256"
    })
  });

  // Si Vault dit que le token est invalide ou expiré (403 ou 400 avec erreurs)
  if (res.status === 403 || res.status === 400) {
    const errorData = await res.json();
    const isTokenError = errorData.errors?.some(e => e.includes("permission denied") || e.includes("invalid token"));
    
    // Si le token a expiré et qu'on n'a pas encore réessayé, on réessaie une fois
    if (isTokenError && retry) {
      vaultToken = null; // On invalide le token local
      return signWithVault(payload, false); // On relance avec retry = false
    }
    
    throw new Error(`Vault sign error: ${JSON.stringify(errorData)}`);
  }

  const data = await res.json();

  if (!data.data || !data.data.signature) {
    throw new Error(`Vault sign error: ${JSON.stringify(data)}`);
  }

  const signature = data.data.signature.replace("vault:v1:", "");
  return `${signingInput}.${signature}`;
}

module.exports = { getPublicKey, signWithVault };