const User = require("../models/User");
const Post = require("../models/Post");
const successResponse = require("../utils/successResponse");
const errorResponse = require("../utils/errorResponse");

module.exports = async function (fastify, opts) {

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


        if (userToFollow.followers.includes(req.user.id)) {
          return errorResponse(reply, "Vous suivez déjà cet utilisateur", 400);
        }


        userToFollow.followers.push(req.user.id);
        await userToFollow.save();


        const currentUser = await User.findById(req.user.id);
        currentUser.following.push(req.params.id);
        await currentUser.save();

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