const Notification = require("../models/Notification");
const successResponse = require("../utils/successResponse");
const errorResponse = require("../utils/errorResponse");

module.exports = async function (fastify, opts) {
  // Récupérer les notifications
  fastify.get("/", { preHandler: [fastify.authenticate] }, async (req, reply) => {
    try {
      const notifications = await Notification.find({ user: req.user.id })
        .populate("relatedUser", "username avatar")
        .sort({ createdAt: -1 });
      return successResponse(reply, notifications);
    } catch (err) {
      return errorResponse(reply, "Erreur", 500);
    }
  });

  // Marquer comme lue
  fastify.patch("/:id", { preHandler: [fastify.authenticate] }, async (req, reply) => {
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