const Report = require("../models/Report");
const successResponse = require("../utils/successResponse");
const errorResponse = require("../utils/errorResponse");

module.exports = async function (fastify, opts) {
  // Créer un rapport
  fastify.post("/", { onRequest: [fastify.authenticate] }, async (req, reply) => {
    try {
      const { reportedPostId, reportedUserId, reason, description } = req.body;

      const report = await Report.create({
        reportedPost: reportedPostId,
        reportedUser: reportedUserId,
        reporter: req.user.id,
        reason,
        description
      });

      return successResponse(reply, report, "Rapport créé", 201);
    } catch (err) {
      return errorResponse(reply, "Erreur", 500);
    }
  });

  // Voir les rapports (ADMIN)
  fastify.get("/", { onRequest: [fastify.authenticate] }, async (req, reply) => {
    try {
      if (req.user.role !== "admin") return errorResponse(reply, "Non autorisé", 403);

      const reports = await Report.find()
        .populate({
          path: "reportedPost",
          select: "content image author",
          populate: { path: "author", select: "username _id" },
        })
        .populate("reportedUser", "username email")
        .populate("reporter", "username")
        .sort({ createdAt: -1 });

      return successResponse(reply, reports);
    } catch (err) {
      return errorResponse(reply, "Erreur", 500);
    }
  });

  // Mettre à jour le statut d'un rapport (ADMIN)
  fastify.patch("/:id", { onRequest: [fastify.authenticate] }, async (req, reply) => {
    try {
      if (req.user.role !== "admin") return errorResponse(reply, "Non autorisé", 403);

      const { status } = req.body;
      const report = await Report.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );

      return successResponse(reply, report, "Rapport mis à jour");
    } catch (err) {
      return errorResponse(reply, "Erreur", 500);
    }
  });
};