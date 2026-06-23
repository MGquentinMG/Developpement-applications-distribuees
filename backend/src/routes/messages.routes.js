const Message = require("../models/Message");
const User = require("../models/User");
const successResponse = require("../utils/successResponse");
const errorResponse = require("../utils/errorResponse");

module.exports = async function (fastify, opts) {
  // Récupérer les contacts avec qui on a échangé des messages
  fastify.get("/conversations", { onRequest: [fastify.authenticate] }, async (req, reply) => {
    try {
      const messages = await Message.find({
        $or: [{ sender: req.user.id }, { recipient: req.user.id }],
      }).select("sender recipient").lean();

      const userIdSet = new Set();
      messages.forEach((m) => {
        const other = m.sender.toString() === req.user.id ? m.recipient : m.sender;
        userIdSet.add(other.toString());
      });

      const users = await User.find({ _id: { $in: [...userIdSet] } }).select("username avatar");
      return successResponse(reply, users);
    } catch (err) {
      return errorResponse(reply, "Erreur", 500);
    }
  });

  // Envoyer un message
  fastify.post("/", { onRequest: [fastify.authenticate] }, async (req, reply) => {
    try {
      const { recipientId, content, imageUrl } = req.body;
      if (!content && !imageUrl) return errorResponse(reply, "Contenu ou image requis", 400);
      const message = await Message.create({
        sender: req.user.id,
        recipient: recipientId,
        content: content || "",
        imageUrl,
      });
      return successResponse(reply, message, "Message envoyé", 201);
    } catch (err) {
      return errorResponse(reply, "Erreur", 500);
    }
  });

  // Récupérer les messages avec un user
  fastify.get("/:userId", { onRequest: [fastify.authenticate] }, async (req, reply) => {
    try {
      const messages = await Message.find({
        $or: [
          { sender: req.user.id, recipient: req.params.userId },
          { sender: req.params.userId, recipient: req.user.id }
        ]
      }).sort({ createdAt: -1 });
      return successResponse(reply, messages);
    } catch (err) {
      return errorResponse(reply, "Erreur", 500);
    }
  });
};