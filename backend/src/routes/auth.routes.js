const authController = require("../controllers/auth.controller");
const { validateRegister, validateLogin } = require("../validators/authValidator");

module.exports = async function (fastify, opts) {
  fastify.post("/register", { preHandler: validateRegister }, authController.register);
  fastify.post("/login", { preHandler: validateLogin }, authController.login);

  // ─── Route pour nginx auth_request ───────────────────────
  fastify.get("/validate", { onRequest: [fastify.authenticate] }, async (request, reply) => {
    return reply.status(200).send(); // 200 = JWT valide → nginx laisse passer
  });
};