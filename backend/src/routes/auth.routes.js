const authController = require("../controllers/auth.controller");
const { validateRegister, validateLogin } = require("../validators/authValidator");

module.exports = async function (fastify, opts) {
  // Le middleware validateRegister est exécuté AVANT le contrôleur
  fastify.post("/register", { preHandler: validateRegister }, authController.register);
  fastify.post("/login", { preHandler: validateLogin }, authController.login);
};