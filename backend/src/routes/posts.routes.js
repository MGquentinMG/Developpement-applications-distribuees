const Post = require("../models/Post");
const successResponse = require("../utils/successResponse");
const errorResponse = require("../utils/errorResponse");

module.exports = async function (fastify, opts) {
  // Créer un post
  fastify.post("/", { preHandler: [fastify.authenticate] }, async (req, reply) => {
    try {
      const { content } = req.body;
      const post = await Post.create({
        content,
        author: req.user.id
      });
      return successResponse(reply, post, "Post créé", 201);
    } catch (err) {
      return errorResponse(reply, "Erreur lors de la création", 500);
    }
  });

  // Tous les posts
  fastify.get("/", async (req, reply) => {
    try {
      const posts = await Post.find().populate("author", "username avatar");
      return successResponse(reply, posts);
    } catch (err) {
      return errorResponse(reply, "Erreur", 500);
    }
  });

  // Un post par ID
  fastify.get("/:id", async (req, reply) => {
    try {
      const post = await Post.findById(req.params.id).populate("author");
      if (!post) return errorResponse(reply, "Post non trouvé", 404);
      return successResponse(reply, post);
    } catch (err) {
      return errorResponse(reply, "Erreur", 500);
    }
  });

  // Supprimer un post
  fastify.delete("/:id", { preHandler: [fastify.authenticate] }, async (req, reply) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) return errorResponse(reply, "Post non trouvé", 404);
      if (post.author.toString() !== req.user.id) return errorResponse(reply, "Non autorisé", 403);
      await Post.findByIdAndDelete(req.params.id);
      return successResponse(reply, null, "Post supprimé");
    } catch (err) {
      return errorResponse(reply, "Erreur", 500);
    }
  });

  // Liker un post
  fastify.post("/:id/like", { preHandler: [fastify.authenticate] }, async (req, reply) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) return errorResponse(reply, "Post non trouvé", 404);
      
      const alreadyLiked = post.likes.includes(req.user.id);
      if (alreadyLiked) {
        post.likes = post.likes.filter(id => id.toString() !== req.user.id);
      } else {
        post.likes.push(req.user.id);
      }
      
      await post.save();
      return successResponse(reply, post);
    } catch (err) {
      return errorResponse(reply, "Erreur", 500);
    }
  });
};