const fp = require("fastify-plugin");

async function jwtPlugin(fastify) {
  fastify.register(require("@fastify/jwt"), {
    secret: process.env.JWT_SECRET || "fallback_secret_dev",
    sign: { expiresIn: "7d" },
  });

  fastify.decorate("signJWT", async function (payload) {
    return fastify.jwt.sign(payload);
  });

  fastify.decorate("authenticate", async function (req, reply) {
    try {
      await req.jwtVerify();
    } catch (err) {
      reply.status(401).send({ success: false, message: "Non authentifié" });
    }
  });
}

module.exports = fp(jwtPlugin);
