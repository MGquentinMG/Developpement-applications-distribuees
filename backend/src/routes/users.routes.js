const User = require("../models/User");
const Post = require("../models/Post");
const Notification = require("../models/Notification");
const bcrypt = require("bcryptjs");
const successResponse = require("../utils/successResponse");
const errorResponse = require("../utils/errorResponse");

const userSchema = {
  type: "object",
  properties: {
    _id: { type: "string" },
    username: { type: "string" },
    email: { type: "string" },
    avatar: { type: "string" },
    bio: { type: "string" },
    role: { type: "string", enum: ["visitor", "user", "moderator", "admin"] },
    status: { type: "string", enum: ["pending", "active"] },
    banned: { type: "boolean" },
    age: { type: "number" },
    createdAt: { type: "string", format: "date-time" },
    followers: { type: "array", items: { type: "object" } },
    following: { type: "array", items: { type: "object" } },
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
  fastify.get("/", {
    onRequest: [fastify.authenticate],
    schema: {
      tags: ["Users"],
      summary: "Liste tous les utilisateurs (sauf soi-même)",
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            data: { type: "array", items: userSchema },
          },
        },
      },
    },
  }, async (req, reply) => {
    try {
      const users = await User.find({ _id: { $ne: req.user.id } }).select("-password").sort({ createdAt: -1 });
      return successResponse(reply, users);
    } catch (err) {
      return errorResponse(reply, "Erreur", 500);
    }
  });

  fastify.get("/me", {
    onRequest: [fastify.authenticate],
    schema: {
      tags: ["Users"],
      summary: "Profil de l'utilisateur connecté",
      security: [{ bearerAuth: [] }],
      response: {
        200: { ...S.success, description: "Profil avec followers/following populés" },
      },
    },
  }, async (req, reply) => {
    try {
      const user = await User.findById(req.user.id)
        .select("-password")
        .populate("followers", "username avatar")
        .populate("following", "username avatar");
      return successResponse(reply, user, "Profil récupéré");
    } catch (err) {
      return errorResponse(reply, "Erreur", 500);
    }
  });

  fastify.patch("/me", {
    onRequest: [fastify.authenticate],
    schema: {
      tags: ["Users"],
      summary: "Modifier son profil (pseudo, bio, avatar)",
      security: [{ bearerAuth: [] }],
      body: {
        type: "object",
        properties: {
          username: { type: "string" },
          bio: { type: "string" },
          avatar: { type: "string", description: "URL de l'avatar" },
        },
      },
      response: {
        200: { ...S.success, description: "Profil mis à jour" },
      },
    },
  }, async (req, reply) => {
    try {
      const { username, bio, avatar } = req.body;
      const user = await User.findByIdAndUpdate(req.user.id, { username, bio, avatar }, { new: true }).select("-password");
      return successResponse(reply, user, "Profil mis à jour");
    } catch (err) {
      return errorResponse(reply, "Erreur", 500);
    }
  });

  fastify.get("/pending", {
    onRequest: [fastify.authenticate],
    schema: {
      tags: ["Users — Admin"],
      summary: "Comptes en attente de validation [Admin]",
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            data: { type: "array", items: userSchema },
          },
        },
        403: { ...S.error, description: "Non autorisé" },
      },
    },
  }, async (req, reply) => {
    try {
      if (req.user.role !== "admin") return errorResponse(reply, "Non autorisé", 403);
      const users = await User.find({ status: "pending" }).select("-password").sort({ createdAt: -1 });
      return successResponse(reply, users);
    } catch (err) {
      return errorResponse(reply, "Erreur", 500);
    }
  });

  fastify.post("/admin-create", {
    onRequest: [fastify.authenticate],
    schema: {
      tags: ["Users — Admin"],
      summary: "Créer un compte manuellement avec rôle [Admin]",
      security: [{ bearerAuth: [] }],
      body: {
        type: "object",
        required: ["username", "email", "password"],
        properties: {
          username: { type: "string" },
          email: { type: "string", format: "email" },
          password: { type: "string", minLength: 6 },
          age: { type: "number", default: 18 },
          role: { type: "string", enum: ["user", "moderator", "admin"], default: "user" },
        },
      },
      response: {
        201: { ...S.success, description: "Compte créé avec statut actif" },
        400: { ...S.error, description: "Champs manquants" },
        403: { ...S.error, description: "Non autorisé" },
        409: { ...S.error, description: "Email ou pseudo déjà utilisé" },
      },
    },
  }, async (req, reply) => {
    try {
      if (req.user.role !== "admin") return errorResponse(reply, "Non autorisé", 403);
      const { username, email, password, age, role } = req.body;
      if (!username || !email || !password) return errorResponse(reply, "Champs requis manquants", 400);
      const existing = await User.findOne({ $or: [{ email }, { username }] });
      if (existing) return errorResponse(reply, "Nom d'utilisateur ou email déjà utilisé", 409);
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ username, email, password: hashedPassword, age: age || 18, role: role || "user", status: "active" });
      return successResponse(reply, { id: user._id, username: user.username, email: user.email, role: user.role }, "Compte créé", 201);
    } catch (err) {
      return errorResponse(reply, "Erreur serveur", 500);
    }
  });

  fastify.get("/by-username/:username", {
    schema: {
      tags: ["Users"],
      summary: "Récupérer un profil par pseudo (public)",
      params: {
        type: "object",
        properties: { username: { type: "string" } },
      },
      response: {
        200: { ...S.success, description: "Profil utilisateur" },
        404: { ...S.error, description: "Utilisateur non trouvé" },
      },
    },
  }, async (req, reply) => {
    try {
      const user = await User.findOne({ username: req.params.username })
        .select("-password")
        .populate("followers", "username avatar")
        .populate("following", "username avatar");
      if (!user) return errorResponse(reply, "User non trouvé", 404);
      return successResponse(reply, user);
    } catch (err) {
      return errorResponse(reply, "Erreur", 500);
    }
  });

  fastify.get("/:id", {
    schema: {
      tags: ["Users"],
      summary: "Récupérer un profil par ID (public)",
      params: S.idParam,
      response: {
        200: { ...S.success, description: "Profil utilisateur" },
        404: { ...S.error, description: "Utilisateur non trouvé" },
      },
    },
  }, async (req, reply) => {
    try {
      const user = await User.findById(req.params.id)
        .select("-password")
        .populate("followers", "username avatar")
        .populate("following", "username avatar");
      if (!user) return errorResponse(reply, "User non trouvé", 404);
      return successResponse(reply, user);
    } catch (err) {
      return errorResponse(reply, "Erreur", 500);
    }
  });

  fastify.patch("/:id/approve", {
    onRequest: [fastify.authenticate],
    schema: {
      tags: ["Users — Admin"],
      summary: "Approuver un compte en attente [Admin]",
      security: [{ bearerAuth: [] }],
      params: S.idParam,
      response: {
        200: { ...S.success, description: "Compte approuvé (status → active)" },
        403: { ...S.error, description: "Non autorisé" },
        404: { ...S.error, description: "Utilisateur non trouvé" },
      },
    },
  }, async (req, reply) => {
    try {
      if (req.user.role !== "admin") return errorResponse(reply, "Non autorisé", 403);
      const user = await User.findByIdAndUpdate(req.params.id, { status: "active" }, { new: true }).select("-password");
      if (!user) return errorResponse(reply, "Utilisateur non trouvé", 404);
      return successResponse(reply, user, "Compte approuvé");
    } catch (err) {
      return errorResponse(reply, "Erreur", 500);
    }
  });

  fastify.patch("/:id/role", {
    onRequest: [fastify.authenticate],
    schema: {
      tags: ["Users — Admin"],
      summary: "Changer le rôle d'un utilisateur [Admin]",
      security: [{ bearerAuth: [] }],
      params: S.idParam,
      body: {
        type: "object",
        required: ["role"],
        properties: {
          role: { type: "string", enum: ["user", "moderator", "admin"] },
        },
      },
      response: {
        200: { ...S.success, description: "Rôle mis à jour" },
        400: { ...S.error, description: "Rôle invalide" },
        403: { ...S.error, description: "Non autorisé" },
      },
    },
  }, async (req, reply) => {
    try {
      if (req.user.role !== "admin") return errorResponse(reply, "Non autorisé", 403);
      const { role } = req.body;
      if (!["user", "moderator", "admin"].includes(role)) return errorResponse(reply, "Rôle invalide", 400);
      const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select("-password");
      if (!user) return errorResponse(reply, "Utilisateur non trouvé", 404);
      return successResponse(reply, user, "Rôle mis à jour");
    } catch (err) {
      return errorResponse(reply, "Erreur", 500);
    }
  });

  fastify.post("/:id/follow", {
    onRequest: [fastify.authenticate],
    schema: {
      tags: ["Users"],
      summary: "Suivre un utilisateur",
      security: [{ bearerAuth: [] }],
      params: S.idParam,
      response: {
        200: { ...S.success, description: "Utilisateur suivi" },
        400: { ...S.error, description: "Déjà suivi" },
        404: { ...S.error, description: "Utilisateur non trouvé" },
      },
    },
  }, async (req, reply) => {
    try {
      const userToFollow = await User.findById(req.params.id);
      if (!userToFollow) return errorResponse(reply, "User non trouvé", 404);
      if (userToFollow.followers.some((id) => id.toString() === req.user.id)) {
        return errorResponse(reply, "Vous suivez déjà cet utilisateur", 400);
      }
      userToFollow.followers.push(req.user.id);
      await userToFollow.save();
      const currentUser = await User.findById(req.user.id);
      currentUser.following.push(req.params.id);
      await currentUser.save();
      await Notification.create({ user: req.params.id, type: "follow", relatedUser: req.user.id });
      return successResponse(reply, null, "Utilisateur suivi");
    } catch (err) {
      return errorResponse(reply, "Erreur", 500);
    }
  });

  fastify.post("/:id/unfollow", {
    onRequest: [fastify.authenticate],
    schema: {
      tags: ["Users"],
      summary: "Ne plus suivre un utilisateur",
      security: [{ bearerAuth: [] }],
      params: S.idParam,
      response: {
        200: { ...S.success, description: "Utilisateur non suivi" },
        404: { ...S.error, description: "Utilisateur non trouvé" },
      },
    },
  }, async (req, reply) => {
    try {
      const userToUnfollow = await User.findById(req.params.id);
      if (!userToUnfollow) return errorResponse(reply, "User non trouvé", 404);
      userToUnfollow.followers = userToUnfollow.followers.filter((id) => id.toString() !== req.user.id);
      await userToUnfollow.save();
      const currentUser = await User.findById(req.user.id);
      currentUser.following = currentUser.following.filter((id) => id.toString() !== req.params.id);
      await currentUser.save();
      return successResponse(reply, null, "Utilisateur non suivi");
    } catch (err) {
      return errorResponse(reply, "Erreur", 500);
    }
  });

  fastify.get("/:id/followers", {
    schema: {
      tags: ["Users"],
      summary: "Liste des abonnés d'un utilisateur (public)",
      params: S.idParam,
      response: {
        200: { ...S.success, description: "Liste des abonnés" },
        404: { ...S.error, description: "Utilisateur non trouvé" },
      },
    },
  }, async (req, reply) => {
    try {
      const user = await User.findById(req.params.id).select("followers").populate("followers", "username avatar");
      if (!user) return errorResponse(reply, "User non trouvé", 404);
      return successResponse(reply, user.followers);
    } catch (err) {
      return errorResponse(reply, "Erreur", 500);
    }
  });

  fastify.get("/:id/following", {
    schema: {
      tags: ["Users"],
      summary: "Liste des abonnements d'un utilisateur (public)",
      params: S.idParam,
      response: {
        200: { ...S.success, description: "Liste des abonnements" },
        404: { ...S.error, description: "Utilisateur non trouvé" },
      },
    },
  }, async (req, reply) => {
    try {
      const user = await User.findById(req.params.id).select("following").populate("following", "username avatar");
      if (!user) return errorResponse(reply, "User non trouvé", 404);
      return successResponse(reply, user.following);
    } catch (err) {
      return errorResponse(reply, "Erreur", 500);
    }
  });

  fastify.get("/:id/posts", {
    schema: {
      tags: ["Users"],
      summary: "Posts publiés par un utilisateur (public)",
      params: S.idParam,
      response: {
        200: { ...S.success, description: "Liste des posts de l'utilisateur" },
      },
    },
  }, async (req, reply) => {
    try {
      const posts = await Post.find({ author: req.params.id })
        .populate("author", "username avatar")
        .sort({ createdAt: -1 });
      return successResponse(reply, posts);
    } catch (err) {
      return errorResponse(reply, "Erreur", 500);
    }
  });

  fastify.delete("/:id", {
    onRequest: [fastify.authenticate],
    schema: {
      tags: ["Users — Admin"],
      summary: "Supprimer un compte et tous ses posts [Admin]",
      security: [{ bearerAuth: [] }],
      params: S.idParam,
      response: {
        200: { ...S.success, description: "Utilisateur et posts supprimés" },
        403: { ...S.error, description: "Non autorisé" },
      },
    },
  }, async (req, reply) => {
    try {
      if (req.user.role !== "admin") return errorResponse(reply, "Non autorisé", 403);
      await User.findByIdAndDelete(req.params.id);
      await Post.deleteMany({ author: req.params.id });
      return successResponse(reply, null, "Utilisateur supprimé");
    } catch (err) {
      return errorResponse(reply, "Erreur", 500);
    }
  });

  fastify.patch("/:id/ban", {
    onRequest: [fastify.authenticate],
    schema: {
      tags: ["Users — Admin"],
      summary: "Bannir un utilisateur [Admin]",
      security: [{ bearerAuth: [] }],
      params: S.idParam,
      body: {
        type: "object",
        properties: {
          banReason: { type: "string", description: "Motif du bannissement" },
        },
      },
      response: {
        200: { ...S.success, description: "Utilisateur banni" },
        403: { ...S.error, description: "Non autorisé" },
      },
    },
  }, async (req, reply) => {
    try {
      if (req.user.role !== "admin") return errorResponse(reply, "Non autorisé", 403);
      const { banReason } = req.body;
      const user = await User.findByIdAndUpdate(req.params.id, { banned: true, banReason }, { new: true });
      return successResponse(reply, user, "Utilisateur banni");
    } catch (err) {
      return errorResponse(reply, "Erreur", 500);
    }
  });

  fastify.patch("/:id/unban", {
    onRequest: [fastify.authenticate],
    schema: {
      tags: ["Users — Admin"],
      summary: "Débannir un utilisateur [Admin]",
      security: [{ bearerAuth: [] }],
      params: S.idParam,
      response: {
        200: { ...S.success, description: "Utilisateur débanni" },
        403: { ...S.error, description: "Non autorisé" },
      },
    },
  }, async (req, reply) => {
    try {
      if (req.user.role !== "admin") return errorResponse(reply, "Non autorisé", 403);
      const user = await User.findByIdAndUpdate(req.params.id, { banned: false, banReason: null }, { new: true });
      return successResponse(reply, user, "Utilisateur débanni");
    } catch (err) {
      return errorResponse(reply, "Erreur", 500);
    }
  });
};
