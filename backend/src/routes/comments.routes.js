const Comment = require("../models/Comment");
const Post = require("../models/Post");
const Notification = require("../models/Notification");
const successResponse = require("../utils/successResponse");
const errorResponse = require("../utils/errorResponse");

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
  fastify.post("/:postId", {
    onRequest: [fastify.authenticate],
    schema: {
      tags: ["Comments"],
      summary: "Ajouter un commentaire à un post",
      security: [{ bearerAuth: [] }],
      params: {
        type: "object",
        properties: { postId: { type: "string", description: "ID du post" } },
      },
      body: {
        type: "object",
        properties: {
          content: { type: "string", description: "Texte du commentaire" },
          imageUrl: { type: "string", description: "URL d'une image attachée" },
        },
      },
      response: {
        201: { ...S.success, description: "Commentaire créé" },
        400: { ...S.error, description: "Contenu ou image requis" },
        404: { ...S.error, description: "Post non trouvé" },
      },
    },
  }, async (req, reply) => {
    try {
      const { content, imageUrl } = req.body;
      if (!content && !imageUrl) return errorResponse(reply, "Contenu ou image requis", 400);

      const post = await Post.findById(req.params.postId);
      if (!post) return errorResponse(reply, "Post non trouvé", 404);

      const comment = await Comment.create({
        content: content || "",
        imageUrl,
        author: req.user.id,
        post: req.params.postId,
      });

      post.comments.push(comment._id);
      await post.save();

      if (post.author.toString() !== req.user.id) {
        await Notification.create({
          user: post.author,
          type: "comment",
          relatedUser: req.user.id,
          relatedPost: post._id,
        });
      }

      return successResponse(reply, comment, "Commentaire créé", 201);
    } catch (err) {
      return errorResponse(reply, "Erreur", 500);
    }
  });

  fastify.post("/:commentId/replies", {
    onRequest: [fastify.authenticate],
    schema: {
      tags: ["Comments"],
      summary: "Répondre à un commentaire",
      security: [{ bearerAuth: [] }],
      params: {
        type: "object",
        properties: { commentId: { type: "string", description: "ID du commentaire parent" } },
      },
      body: {
        type: "object",
        required: ["content"],
        properties: {
          content: { type: "string" },
        },
      },
      response: {
        201: { ...S.success, description: "Réponse créée" },
        404: { ...S.error, description: "Commentaire parent non trouvé" },
      },
    },
  }, async (req, reply) => {
    try {
      const { content } = req.body;
      const parentComment = await Comment.findById(req.params.commentId);
      if (!parentComment) return errorResponse(reply, "Commentaire non trouvé", 404);

      const newReply = await Comment.create({
        content,
        author: req.user.id,
        post: parentComment.post,
        parentComment: req.params.commentId,
      });

      parentComment.replies.push(newReply._id);
      await parentComment.save();

      return successResponse(reply, newReply, "Réponse créée", 201);
    } catch (err) {
      return errorResponse(reply, "Erreur", 500);
    }
  });

  fastify.post("/:id/like", {
    onRequest: [fastify.authenticate],
    schema: {
      tags: ["Comments"],
      summary: "Liker / unliker un commentaire (toggle)",
      security: [{ bearerAuth: [] }],
      params: S.idParam,
      response: {
        200: { ...S.success, description: "Likes mis à jour" },
        404: { ...S.error, description: "Commentaire non trouvé" },
      },
    },
  }, async (req, reply) => {
    try {
      const comment = await Comment.findById(req.params.id);
      if (!comment) return errorResponse(reply, "Commentaire non trouvé", 404);

      const alreadyLiked = comment.likes.includes(req.user.id);
      if (alreadyLiked) {
        comment.likes = comment.likes.filter((id) => id.toString() !== req.user.id);
      } else {
        comment.likes.push(req.user.id);
      }
      await comment.save();
      return successResponse(reply, { likes: comment.likes });
    } catch (err) {
      return errorResponse(reply, "Erreur", 500);
    }
  });

  fastify.delete("/:id", {
    onRequest: [fastify.authenticate],
    schema: {
      tags: ["Comments"],
      summary: "Supprimer son propre commentaire",
      security: [{ bearerAuth: [] }],
      params: S.idParam,
      response: {
        200: { ...S.success, description: "Commentaire supprimé" },
        403: { ...S.error, description: "Non autorisé (pas l'auteur)" },
        404: { ...S.error, description: "Commentaire non trouvé" },
      },
    },
  }, async (req, reply) => {
    try {
      const comment = await Comment.findById(req.params.id);
      if (!comment) return errorResponse(reply, "Commentaire non trouvé", 404);
      if (comment.author.toString() !== req.user.id) return errorResponse(reply, "Non autorisé", 403);
      await Comment.findByIdAndDelete(req.params.id);
      return successResponse(reply, null, "Commentaire supprimé");
    } catch (err) {
      return errorResponse(reply, "Erreur", 500);
    }
  });
};
