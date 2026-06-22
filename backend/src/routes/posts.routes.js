const Post = require("../models/Post");
const User = require("../models/User");
const successResponse = require("../utils/successResponse");
const errorResponse = require("../utils/errorResponse");

module.exports = async function (fastify, opts) {
  // Créer un post
  fastify.post("/", { onRequest: [fastify.authenticate] }, async (req, reply) => {
    try {
      const { content, tags, image, video, mentions } = req.body;
      const post = await Post.create({
        content,
        author: req.user.id,
        tags: tags || [],
        image,
        video,
        mentions: mentions || []
      });
      return successResponse(reply, post, "Post créé", 201);
    } catch (err) {
      return errorResponse(reply, "Erreur lors de la création", 500);
    }
  });

  // Tous les posts
  fastify.get("/", async (req, reply) => {
    try {
      const posts = await Post.find()
        .populate("author", "username avatar")
        .populate("mentions", "username")
        .sort({ createdAt: -1 });
      return successResponse(reply, posts);
    } catch (err) {
      return errorResponse(reply, "Erreur", 500);
    }
  });

  fastify.get("/feed", { onRequest: [fastify.authenticate] }, async (req, reply) => {
    try {
      const user = await User.findById(req.user.id).select("following");
      
      const posts = await Post.find({
        author: { $in: user.following }
      })
        .populate("author", "username avatar")
        .sort({ createdAt: -1 });
      
      return successResponse(reply, posts);
    } catch (err) {
      return errorResponse(reply, "Erreur", 500);
    }
  });


  fastify.get("/search", async (req, reply) => {
    try {
      const { tag, q } = req.query;

      let query = {};
      if (tag) query.tags = tag;
      if (q) query.content = { $regex: q, $options: "i" };

      const posts = await Post.find(query)
        .populate("author", "username avatar")
        .sort({ createdAt: -1 });

      return successResponse(reply, posts);
    } catch (err) {
      return errorResponse(reply, "Erreur", 500);
    }
  });

  // Un post par ID
  fastify.get("/:id", async (req, reply) => {
    try {
      const post = await Post.findById(req.params.id)
        .populate("author", "username avatar")
        .populate({
          path: "comments",
          populate: { path: "author", select: "username avatar" },
        });
      if (!post) return errorResponse(reply, "Post non trouvé", 404);
      return successResponse(reply, post);
    } catch (err) {
      return errorResponse(reply, "Erreur", 500);
    }
  });

  // Supprimer un post
  fastify.delete("/:id", { onRequest: [fastify.authenticate] }, async (req, reply) => {
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
  fastify.post("/:id/like", { onRequest: [fastify.authenticate] }, async (req, reply) => {
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