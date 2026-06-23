const fp = require("fastify-plugin");
const fastifyJwt = require("@fastify/jwt");
const { getPublicKey, signWithVault } = require("../services/vault_service");

module.exports = fp(async function (app) {
  const publicKey = await getPublicKey();

  app.register(fastifyJwt, {
    secret: {
      private: null,   // on ne signe pas via @fastify/jwt
      public: publicKey
    },
    sign: { algorithm: "ES256" }
  });

  // Override du sign pour passer par Vault
  app.decorate("signJWT", async function (payload) {
    return signWithVault(payload);
  });

  app.decorate("authenticate", async function (request, reply) {
    try {
      await request.jwtVerify();
    } catch (err) {
      request.log.error(err, "Échec de la validation JWT");
      reply.status(401).send({ error: "Unauthorized" });
    }
  });
});
