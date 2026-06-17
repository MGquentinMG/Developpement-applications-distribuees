const User = require("../models/User");
const successResponse = require("../utils/successResponse");
const errorResponse = require("../utils/errorResponse");

module.exports = async function (fastify, opts) {
  // Récupérer le profil connecté
  fastify.get("/me", { preHandler: [fastify.authenticate] }, async (req, reply) => {
    return successResponse(reply, req.user, "Profil récupéré");
  });

  // Récupérer un user par ID
  fastify.get("/:id", async (req, reply) => {
    try {
      const user = await User.findById(req.params.id).select("-password");
      if (!user) return errorResponse(reply, "User non trouvé", 404);
      return successResponse(reply, user);
    } catch (err) {
      return errorResponse(reply, "Erreur", 500);
    }
  });

  // Mettre à jour le profil
  fastify.patch("/me", { preHandler: [fastify.authenticate] }, async (req, reply) => {
    try {
      const { username, bio, avatar } = req.body;
      const user = await User.findByIdAndUpdate(
        req.user.id,
        { username, bio, avatar },
        { new: true }
      ).select("-password");
      return successResponse(reply, user, "Profil mis à jour");
    } catch (err) {
      return errorResponse(reply, "Erreur", 500);
    }
  });
};