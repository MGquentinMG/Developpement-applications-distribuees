const Post = require("../models/Post");
const User = require("../models/User");
const Notification = require("../models/Notification");
const successResponse = require("../utils/successResponse");
const errorResponse = require("../utils/errorResponse");

const postSchema = {
  type: "object",
  properties: {
    _id: { type: "string" },
    content: { type: "string" },
    image: { type: "string" },
    video: { type: "string" },
    tags: { type: "array", items: { type: "string" } },
    likes: { type: "array", items: { type: "string" } },
    comments: { type: "array", items: { type: "string" } },
    author: {
      type: "object",
      properties: {
        _id: { type: "string" },
        username: { type: "string" },
        avatar: { type: "string" },
      },
    },
    createdAt: { type: "string", format: "date-time" },
  },
};

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
    properties: { success: { type: "boolean" }, message: { type: "string" } },
  },
  idParam: {
    type: "object",
    properties: { id: { type: "string", description: "MongoDB ObjectId" } },
  },
};

module.exports = async function (fastify, opts) {
  fastify.post("/", {
    onRequest: [fastify.authenticate],
    schema: {
      tags: ["Posts"],
      summary: "Créer un post",
      security: [{ bearerAuth: [] }],
      body: {
        type: "object",
        properties: {
          content: { type: "string", description: "Texte du post" },
          tags: { type: "array", items: { type: "string" }, description: "Hashtags" },
          image: { type: "string", description: "URL de l'image (après upload)" },
          video: { type: "string", description: "URL de la vidéo" },
          mentions: { type: "array", items: { type: "string" }, description: "IDs des utilisateurs mentionnés" },
        },
      },
      response: {
        201: { ...S.success, description: "Post créé" },
        500: { ...S.error, description: "Erreur serveur" },
      },
    },
  }, async (req, reply) => {
    try {
      const { content, tags, image, video, mentions } = req.body;
      const post = await Post.create({
        content,
        author: req.user.id,
        tags: tags || [],
        image,
        video,
        mentions: mentions || [],
      });
      return successResponse(reply, post, "Post créé", 201);
    } catch (err) {
      return errorResponse(reply, "Erreur lors de la création", 500);
    }
  });

  fastify.get("/", {
    schema: {
      tags: ["Posts"],
      summary: "Récupérer tous les posts (public)",
      response: {
        200: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            message: { type: "string" },
            data: { type: "array", items: postSchema },
          },
        },
      },
    },
  }, async (req, reply) => {
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

  fastify.get("/feed", {
    onRequest: [fastify.authenticate],
    schema: {
      tags: ["Posts"],
      summary: "Fil d'actualité des comptes suivis",
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            message: { type: "string" },
            data: { type: "array", items: postSchema },
          },
        },
      },
    },
  }, async (req, reply) => {
    try {
      const user = await User.findById(req.user.id).select("following");
      const posts = await Post.find({ author: { $in: user.following } })
        .populate("author", "username avatar")
        .sort({ createdAt: -1 });
      return successResponse(reply, posts);
    } catch (err) {
      return errorResponse(reply, "Erreur", 500);
    }
  });

  fastify.get("/search", {
    schema: {
      tags: ["Posts"],
      summary: "Rechercher des posts par tag ou mot-clé (public)",
      querystring: {
        type: "object",
        properties: {
          tag: { type: "string", description: "Filtrer par hashtag" },
          q: { type: "string", description: "Recherche full-text dans le contenu" },
        },
      },
      response: {
        200: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            data: { type: "array", items: postSchema },
          },
        },
      },
    },
  }, async (req, reply) => {
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

  fastify.get("/:id", {
    schema: {
      tags: ["Posts"],
      summary: "Récupérer un post avec ses commentaires (public)",
      params: S.idParam,
      response: {
        200: { ...S.success, description: "Post avec commentaires populés" },
        404: { ...S.error, description: "Post non trouvé" },
      },
    },
  }, async (req, reply) => {
    try {
      const post = await Post.findById(req.params.id)
        .populate("author", "username avatar")
        .populate({ path: "comments", populate: { path: "author", select: "username avatar" } });
      if (!post) return errorResponse(reply, "Post non trouvé", 404);
      return successResponse(reply, post);
    } catch (err) {
      return errorResponse(reply, "Erreur", 500);
    }
  });

  fastify.patch("/:id", {
    onRequest: [fastify.authenticate],
    schema: {
      tags: ["Posts"],
      summary: "Modifier le contenu de son propre post",
      security: [{ bearerAuth: [] }],
      params: S.idParam,
      body: {
        type: "object",
        required: ["content"],
        properties: { content: { type: "string" } },
      },
      response: {
        200: { ...S.success, description: "Post modifié" },
        403: { ...S.error, description: "Non autorisé" },
        404: { ...S.error, description: "Post non trouvé" },
      },
    },
  }, async (req, reply) => {
    try {
      const { content } = req.body;
      if (!content?.trim()) return errorResponse(reply, "Contenu requis", 400);
      const post = await Post.findById(req.params.id);
      if (!post) return errorResponse(reply, "Post non trouvé", 404);
      if (post.author.toString() !== req.user.id) return errorResponse(reply, "Non autorisé", 403);
      post.content = content.trim();
      await post.save();
      return successResponse(reply, post, "Post modifié");
    } catch (err) {
      return errorResponse(reply, "Erreur", 500);
    }
  });

  fastify.delete("/:id", {
    onRequest: [fastify.authenticate],
    schema: {
      tags: ["Posts"],
      summary: "Supprimer son propre post",
      security: [{ bearerAuth: [] }],
      params: S.idParam,
      response: {
        200: { ...S.success, description: "Post supprimé" },
        403: { ...S.error, description: "Non autorisé (pas l'auteur)" },
        404: { ...S.error, description: "Post non trouvé" },
      },
    },
  }, async (req, reply) => {
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

  fastify.post("/:id/like", {
    onRequest: [fastify.authenticate],
    schema: {
      tags: ["Posts"],
      summary: "Liker / unliker un post (toggle)",
      security: [{ bearerAuth: [] }],
      params: S.idParam,
      response: {
        200: { ...S.success, description: "Post mis à jour (likes)" },
        404: { ...S.error, description: "Post non trouvé" },
      },
    },
  }, async (req, reply) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) return errorResponse(reply, "Post non trouvé", 404);

      const alreadyLiked = post.likes.includes(req.user.id);
      if (alreadyLiked) {
        post.likes = post.likes.filter((id) => id.toString() !== req.user.id);
      } else {
        post.likes.push(req.user.id);
        if (post.author.toString() !== req.user.id) {
          await Notification.create({
            user: post.author,
            type: "like",
            relatedUser: req.user.id,
            relatedPost: post._id,
          });
        }
      }

      await post.save();
      return successResponse(reply, post);
    } catch (err) {
      return errorResponse(reply, "Erreur", 500);
    }
  });
};
