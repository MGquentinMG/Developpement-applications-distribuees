const Comment = require("../models/Comment");
const Post = require("../models/Post");
const Notification = require("../models/Notification");
const successResponse = require("../utils/successResponse");
const errorResponse = require("../utils/errorResponse");

module.exports = async function (fastify, opts) {
  // Ajouter un commentaire
  fastify.post("/:postId", { onRequest: [fastify.authenticate] }, async (req, reply) => {
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


  fastify.post("/:commentId/replies", { onRequest: [fastify.authenticate] }, async (req, reply) => {
    try {
      const { content } = req.body;
      const parentComment = await Comment.findById(req.params.commentId);
      if (!parentComment) return errorResponse(reply, "Commentaire non trouvé", 404);

      const reply = await Comment.create({
        content,
        author: req.user.id,
        post: parentComment.post,
        parentComment: req.params.commentId
      });

      parentComment.replies.push(reply._id);
      await parentComment.save();

      return successResponse(reply, reply, "Réponse créée", 201);
    } catch (err) {
      return errorResponse(reply, "Erreur", 500);
    }
  });

  // Liker un commentaire
  fastify.post("/:id/like", { onRequest: [fastify.authenticate] }, async (req, reply) => {
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

  // Supprimer un commentaire
  fastify.delete("/:id", { onRequest: [fastify.authenticate] }, async (req, reply) => {
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