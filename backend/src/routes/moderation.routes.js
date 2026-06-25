const Post = require("../models/Post");
const Comment = require("../models/Comment");
const errorResponse = require("../utils/errorResponse");
const successResponse = require("../utils/successResponse");

const S = {
  success: {
    type: "object",
    properties: { success: { type: "boolean" }, message: { type: "string" }, data: {} },
  },
  error: {
    type: "object",
    properties: { success: { type: "boolean" }, message: { type: "string" } },
  },
  idParam: {
    type: "object",
    properties: { id: { type: "string", description: "MongoDB ObjectId" } },
  },
};

module.exports = async function (fastify, opts) {
  fastify.delete("/posts/:id", {
    onRequest: [fastify.authenticate],
    schema: {
      tags: ["Moderation"],
      summary: "Supprimer n'importe quel post [Admin]",
      security: [{ bearerAuth: [] }],
      params: S.idParam,
      response: {
        200: { ...S.success, description: "Post supprimé par la modération" },
        403: { ...S.error, description: "Non autorisé (rôle admin requis)" },
      },
    },
  }, async (req, reply) => {
    try {
      if (req.user.role !== "admin") return errorResponse(reply, "Non autorisé", 403);
      await Post.findByIdAndDelete(req.params.id);
      return successResponse(reply, null, "Post supprimé");
    } catch (err) {
      return errorResponse(reply, "Erreur", 500);
    }
  });

  fastify.delete("/comments/:id", {
    onRequest: [fastify.authenticate],
    schema: {
      tags: ["Moderation"],
      summary: "Supprimer n'importe quel commentaire [Admin]",
      security: [{ bearerAuth: [] }],
      params: S.idParam,
      response: {
        200: { ...S.success, description: "Commentaire supprimé par la modération" },
        403: { ...S.error, description: "Non autorisé (rôle admin requis)" },
      },
    },
  }, async (req, reply) => {
    try {
      if (req.user.role !== "admin") return errorResponse(reply, "Non autorisé", 403);
      await Comment.findByIdAndDelete(req.params.id);
      return successResponse(reply, null, "Commentaire supprimé");
    } catch (err) {
      return errorResponse(reply, "Erreur", 500);
    }
  });
};
