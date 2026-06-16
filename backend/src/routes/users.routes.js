// src/routes/user.routes.js
const successResponse = require("../utils/successResponse");

module.exports = async function (fastify, opts) {
  fastify.get("/me", { preHandler: [fastify.authenticate] }, async (req, reply) => {
    // req.user est injecté par fastify-jwt après vérification
    return successResponse(reply, req.user, "Profil récupéré avec succès");
  });
};