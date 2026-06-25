const Notification = require("../models/Notification");
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
  idParam: {
    type: "object",
    properties: { id: { type: "string", description: "MongoDB ObjectId" } },
  },
};

module.exports = async function (fastify, opts) {
  fastify.get("/", {
    onRequest: [fastify.authenticate],
    schema: {
      tags: ["Notifications"],
      summary: "Récupérer ses notifications",
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
                  type: { type: "string", enum: ["like", "comment", "follow", "share"] },
                  read: { type: "boolean" },
                  relatedUser: {
                    type: "object",
                    properties: {
                      _id: { type: "string" },
                      username: { type: "string" },
                      avatar: { type: "string" },
                    },
                  },
                  relatedPost: { type: "string" },
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
      const notifications = await Notification.find({ user: req.user.id })
        .populate("relatedUser", "username avatar")
        .sort({ createdAt: -1 });
      return successResponse(reply, notifications);
    } catch (err) {
      return errorResponse(reply, "Erreur", 500);
    }
  });

  fastify.patch("/:id", {
    onRequest: [fastify.authenticate],
    schema: {
      tags: ["Notifications"],
      summary: "Marquer une notification comme lue",
      security: [{ bearerAuth: [] }],
      params: S.idParam,
      response: {
        200: { ...S.success, description: "Notification marquée comme lue" },
      },
    },
  }, async (req, reply) => {
    try {
      const notification = await Notification.findByIdAndUpdate(
        req.params.id,
        { read: true },
        { new: true }
      );
      return successResponse(reply, notification);
    } catch (err) {
      return errorResponse(reply, "Erreur", 500);
    }
  });
};
