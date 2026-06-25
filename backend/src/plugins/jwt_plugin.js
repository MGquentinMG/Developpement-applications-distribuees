const fp = require("fastify-plugin");
const fastifyJwt = require("@fastify/jwt");
const { getPublicKey, signWithVault } = require("../services/vault_service");

module.exports = fp(async function (app) {
  const publicKey = await getPublicKey();

  if (publicKey) {
    app.log.info("JWT: mode Vault (ES256)");
    app.register(fastifyJwt, {
      secret: { private: null, public: publicKey },
      sign: { algorithm: "ES256" },
    });
    app.decorate("signJWT", signWithVault);
  } else {
    const secret = process.env.JWT_SECRET || "breezy_dev_fallback";
    app.log.warn("JWT: Vault indisponible, fallback HS256 (JWT_SECRET)");
    app.register(fastifyJwt, {
      secret,
      sign: { expiresIn: "7d" },
    });
    app.decorate("signJWT", async function (payload) {
      return app.jwt.sign(payload);
    });
  }

  app.decorate("authenticate", async function (request, reply) {
    try {
      await request.jwtVerify();
    } catch (err) {
      request.log.error(err, "Échec de la validation JWT");
      reply.status(401).send({ error: "Unauthorized" });
    }
  });
});
