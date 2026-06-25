const Message = require("../models/Message");
const User = require("../models/User");
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
};

module.exports = async function (fastify, opts) {
  fastify.get("/conversations", {
    onRequest: [fastify.authenticate],
    schema: {
      tags: ["Messages"],
      summary: "Liste des contacts avec qui on a échangé des messages",
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            data: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  _id: { type: "string" },
                  username: { type: "string" },
                  avatar: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
  }, async (req, reply) => {
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

  fastify.post("/", {
    onRequest: [fastify.authenticate],
    schema: {
      tags: ["Messages"],
      summary: "Envoyer un message privé",
      security: [{ bearerAuth: [] }],
      body: {
        type: "object",
        required: ["recipientId"],
        properties: {
          recipientId: { type: "string", description: "ID de l'utilisateur destinataire" },
          content: { type: "string", description: "Texte du message" },
          imageUrl: { type: "string", description: "URL d'une image attachée" },
        },
      },
      response: {
        201: { ...S.success, description: "Message envoyé" },
        400: { ...S.error, description: "Contenu ou image requis" },
      },
    },
  }, async (req, reply) => {
    try {
      const { recipientId, content, imageUrl } = req.body;
      if (!content && !imageUrl) return errorResponse(reply, "Contenu ou image requis", 400);
      const msg = await Message.create({
        sender: req.user.id,
        recipient: recipientId,
        content: content || "",
        imageUrl,
      });
      return successResponse(reply, msg, "Message envoyé", 201);
    } catch (err) {
      return errorResponse(reply, "Erreur", 500);
    }
  });

  fastify.get("/:userId", {
    onRequest: [fastify.authenticate],
    schema: {
      tags: ["Messages"],
      summary: "Récupérer la conversation avec un utilisateur",
      security: [{ bearerAuth: [] }],
      params: {
        type: "object",
        properties: { userId: { type: "string", description: "ID de l'autre participant" } },
      },
      response: {
        200: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            data: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  _id: { type: "string" },
                  sender: { type: "string" },
                  recipient: { type: "string" },
                  content: { type: "string" },
                  imageUrl: { type: "string" },
                  createdAt: { type: "string", format: "date-time" },
                },
              },
            },
          },
        },
      },
    },
  }, async (req, reply) => {
    try {
      const messages = await Message.find({
        $or: [
          { sender: req.user.id, recipient: req.params.userId },
          { sender: req.params.userId, recipient: req.user.id },
        ],
      }).sort({ createdAt: -1 });
      return successResponse(reply, messages);
    } catch (err) {
      return errorResponse(reply, "Erreur", 500);
    }
  });
};
