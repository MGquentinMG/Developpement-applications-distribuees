const User = require("../models/User");
const Post = require("../models/Post");
const Notification = require("../models/Notification");
const bcrypt = require("bcryptjs");
const successResponse = require("../utils/successResponse");
const errorResponse = require("../utils/errorResponse");

module.exports = async function (fastify, opts) {

  fastify.get("/", { onRequest: [fastify.authenticate] }, async (req, reply) => {
    try {
      const users = await User.find({ _id: { $ne: req.user.id } }).select("-password").sort({ createdAt: -1 });
      return successResponse(reply, users);
    } catch (err) {
      return errorResponse(reply, "Erreur", 500);
    }
  });

  fastify.get("/me",
    { 
      onRequest: [fastify.authenticate]
    }, 
    async (req, reply) => {
      try {
        const user = await User.findById(req.user.id)
          .select("-password")
          .populate("followers", "username avatar")
          .populate("following", "username avatar");
        return successResponse(reply, user, "Profil récupéré");
      } catch (err) {
        return errorResponse(reply, "Erreur", 500);
      }
    }
  );


  // Comptes en attente de validation (admin)
  fastify.get("/pending", { onRequest: [fastify.authenticate] }, async (req, reply) => {
    try {
      if (req.user.role !== "admin") return errorResponse(reply, "Non autorisé", 403);
      const users = await User.find({ status: "pending" }).select("-password").sort({ createdAt: -1 });
      return successResponse(reply, users);
    } catch (err) {
      return errorResponse(reply, "Erreur", 500);
    }
  });

  // Approuver un compte (admin)
  fastify.patch("/:id/approve", { onRequest: [fastify.authenticate] }, async (req, reply) => {
    try {
      if (req.user.role !== "admin") return errorResponse(reply, "Non autorisé", 403);
      const user = await User.findByIdAndUpdate(req.params.id, { status: "active" }, { new: true }).select("-password");
      if (!user) return errorResponse(reply, "Utilisateur non trouvé", 404);
      return successResponse(reply, user, "Compte approuvé");
    } catch (err) {
      return errorResponse(reply, "Erreur", 500);
    }
  });

  // Changer le rôle d'un utilisateur (admin)
  fastify.patch("/:id/role", { onRequest: [fastify.authenticate] }, async (req, reply) => {
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

  // Créer un compte depuis l'admin (avec rôle)
  fastify.post("/admin-create", { onRequest: [fastify.authenticate] }, async (req, reply) => {
    try {
      if (req.user.role !== "admin") return errorResponse(reply, "Non autorisé", 403);
      const { username, email, password, age, role } = req.body;
      if (!username || !email || !password) return errorResponse(reply, "Champs requis manquants", 400);
      const existing = await User.findOne({ $or: [{ email }, { username }] });
      if (existing) return errorResponse(reply, "Nom d'utilisateur ou email déjà utilisé", 409);
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        username,
        email,
        password: hashedPassword,
        age: age || 18,
        role: role || "user",
        status: "active"
      });
      return successResponse(reply, { id: user._id, username: user.username, email: user.email, role: user.role }, "Compte créé", 201);
    } catch (err) {
      return errorResponse(reply, "Erreur serveur", 500);
    }
  });

  fastify.get("/by-username/:username", async (req, reply) => {
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

  fastify.get("/:id", async (req, reply) => {
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


  fastify.patch("/me", 
    { 
      onRequest: [fastify.authenticate]
    }, 
    async (req, reply) => {
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
    }
  );


  fastify.post("/:id/follow",
    {
      onRequest: [fastify.authenticate]
    },
    async (req, reply) => {
      try {
        const userToFollow = await User.findById(req.params.id);
        if (!userToFollow) return errorResponse(reply, "User non trouvé", 404);


        if (userToFollow.followers.some(id => id.toString() === req.user.id)) {
          return errorResponse(reply, "Vous suivez déjà cet utilisateur", 400);
        }


        userToFollow.followers.push(req.user.id);
        await userToFollow.save();

        const currentUser = await User.findById(req.user.id);
        currentUser.following.push(req.params.id);
        await currentUser.save();

        await Notification.create({
          user: req.params.id,
          type: "follow",
          relatedUser: req.user.id,
        });

        return successResponse(reply, null, "Utilisateur suivi");
      } catch (err) {
        return errorResponse(reply, "Erreur", 500);
      }
    }
  );


  fastify.post("/:id/unfollow",
    {
      onRequest: [fastify.authenticate]
    },
    async (req, reply) => {
      try {
        const userToUnfollow = await User.findById(req.params.id);
        if (!userToUnfollow) return errorResponse(reply, "User non trouvé", 404);


        userToUnfollow.followers = userToUnfollow.followers.filter(
          id => id.toString() !== req.user.id
        );
        await userToUnfollow.save();

        const currentUser = await User.findById(req.user.id);
        currentUser.following = currentUser.following.filter(
          id => id.toString() !== req.params.id
        );
        await currentUser.save();

        return successResponse(reply, null, "Utilisateur non suivi");
      } catch (err) {
        return errorResponse(reply, "Erreur", 500);
      }
    }
  );


  fastify.get("/:id/followers", async (req, reply) => {
    try {
      const user = await User.findById(req.params.id)
        .select("followers")
        .populate("followers", "username avatar");
      if (!user) return errorResponse(reply, "User non trouvé", 404);
      return successResponse(reply, user.followers);
    } catch (err) {
      return errorResponse(reply, "Erreur", 500);
    }
  });


  fastify.get("/:id/following", async (req, reply) => {
    try {
      const user = await User.findById(req.params.id)
        .select("following")
        .populate("following", "username avatar");
      if (!user) return errorResponse(reply, "User non trouvé", 404);
      return successResponse(reply, user.following);
    } catch (err) {
      return errorResponse(reply, "Erreur", 500);
    }
  });


  fastify.get("/:id/posts", async (req, reply) => {
    try {
      const posts = await Post.find({ author: req.params.id })
        .populate("author", "username avatar")
        .sort({ createdAt: -1 });
      return successResponse(reply, posts);
    } catch (err) {
      return errorResponse(reply, "Erreur", 500);
    }
  });

  fastify.delete("/:id", { onRequest: [fastify.authenticate] }, async (req, reply) => {
    try {
      if (req.user.role !== "admin") return errorResponse(reply, "Non autorisé", 403);
      await User.findByIdAndDelete(req.params.id);
      await Post.deleteMany({ author: req.params.id });
      return successResponse(reply, null, "Utilisateur supprimé");
    } catch (err) {
      return errorResponse(reply, "Erreur", 500);
    }
  });

  fastify.patch("/:id/ban",
    {
      onRequest: [fastify.authenticate]
    },
    async (req, reply) => {
      try {
        if (req.user.role !== "admin") return errorResponse(reply, "Non autorisé", 403);

        const { banReason } = req.body;
        const user = await User.findByIdAndUpdate(
          req.params.id,
          { banned: true, banReason },
          { new: true }
        );

        return successResponse(reply, user, "Utilisateur banni");
      } catch (err) {
        return errorResponse(reply, "Erreur", 500);
      }
    }
  );


  fastify.patch("/:id/unban",
    {
      onRequest: [fastify.authenticate]
    },
    async (req, reply) => {
      try {
        if (req.user.role !== "admin") return errorResponse(reply, "Non autorisé", 403);

        const user = await User.findByIdAndUpdate(
          req.params.id,
          { banned: false, banReason: null },
          { new: true }
        );

        return successResponse(reply, user, "Utilisateur débanni");
      } catch (err) {
        return errorResponse(reply, "Erreur", 500);
      }
    }
  );
};