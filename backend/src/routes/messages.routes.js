const Message = require("../models/Message");
const successResponse = require("../utils/successResponse");
const errorResponse = require("../utils/errorResponse");

module.exports = async function (fastify, opts) {
  // Envoyer un message
  fastify.post("/", { onRequest: [fastify.authenticate] }, async (req, reply) => {
    try {
      const { recipientId, content } = req.body;
      const message = await Message.create({
        sender: req.user.id,
        recipient: recipientId,
        content
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