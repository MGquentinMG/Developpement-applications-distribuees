const authController = require("../controllers/auth.controller");
const { validateRegister, validateLogin } = require("../validators/authValidator");

const S = {
  success: {
    type: "object",
    properties: {
      success: { type: "boolean" },
      message: { type: "string" },
      data: {},
    },
  },
  error: {
    type: "object",
    properties: {
      success: { type: "boolean" },
      message: { type: "string" },
    },
  },
};

module.exports = async function (fastify, opts) {
  fastify.post("/register", {
    preHandler: validateRegister,
    schema: {
      tags: ["Auth"],
      summary: "Créer un compte (inscription en attente de validation)",
      body: {
        type: "object",
        required: ["username", "email", "password", "age"],
        properties: {
          username: { type: "string", minLength: 3, maxLength: 30, description: "Pseudo (alphanumérique)" },
          email: { type: "string", format: "email" },
          password: { type: "string", minLength: 6 },
          age: { type: "number", minimum: 15, maximum: 120 },
        },
      },
      response: {
        201: { ...S.success, description: "Compte créé, en attente de validation admin" },
        400: { ...S.error, description: "Données invalides" },
        409: { ...S.error, description: "Email ou pseudo déjà utilisé" },
      },
    },
  }, authController.register);

  fastify.post("/login", {
    preHandler: validateLogin,
    schema: {
      tags: ["Auth"],
      summary: "Se connecter et obtenir un JWT",
      body: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string", minLength: 6 },
        },
      },
      response: {
        200: {
          type: "object",
          description: "Connexion réussie",
          properties: {
            success: { type: "boolean" },
            message: { type: "string" },
            data: {
              type: "object",
              properties: {
                token: { type: "string", description: "JWT à utiliser dans Authorization: Bearer <token>" },
                user: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    username: { type: "string" },
                    email: { type: "string" },
                    role: { type: "string", enum: ["visitor", "user", "moderator", "admin"] },
                  },
                },
              },
            },
          },
        },
        400: { ...S.error, description: "Identifiants invalides" },
        403: { ...S.error, description: "Compte banni ou en attente de validation" },
      },
    },
  }, authController.login);

  fastify.get("/validate", {
    onRequest: [fastify.authenticate],
    schema: {
      tags: ["Auth"],
      summary: "Valider un JWT (utilisé en interne par nginx auth_request)",
      security: [{ bearerAuth: [] }],
      response: {
        200: { description: "JWT valide" },
        401: { ...S.error, description: "JWT invalide ou expiré" },
      },
    },
  }, async (request, reply) => {
    return reply.status(200).send();
  });
};
