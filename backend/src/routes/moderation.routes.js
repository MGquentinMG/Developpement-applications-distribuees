const Post = require("../models/Post");
const Comment = require("../models/Comment");
const errorResponse = require("../utils/errorResponse");
const successResponse = require("../utils/successResponse");

module.exports = async function (fastify, opts) {
  // Supprimer un post (admin)
  fastify.delete("/posts/:id", { onRequest: [fastify.authenticate] }, async (req, reply) => {
    try {
      if (req.user.role !== "admin") return errorResponse(reply, "Non autorisé", 403);
      await Post.findByIdAndDelete(req.params.id);
      return successResponse(reply, null, "Post supprimé");
    } catch (err) {
      return errorResponse(reply, "Erreur", 500);
    }
  });

  // Supprimer un commentaire (admin)
  fastify.delete("/comments/:id", { onRequest: [fastify.authenticate] }, async (req, reply) => {
    try {
      if (req.user.role !== "admin") return errorResponse(reply, "Non autorisé", 403);
      await Comment.findByIdAndDelete(req.params.id);
      return successResponse(reply, null, "Commentaire supprimé");
    } catch (err) {
      return errorResponse(reply, "Erreur", 500);
    }
  });
};