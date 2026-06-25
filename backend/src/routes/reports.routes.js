const Report = require("../models/Report");
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
  fastify.post("/", {
    onRequest: [fastify.authenticate],
    schema: {
      tags: ["Reports"],
      summary: "Créer un signalement (post, commentaire ou utilisateur)",
      security: [{ bearerAuth: [] }],
      body: {
        type: "object",
        required: ["reason"],
        properties: {
          reportedPostId: { type: "string", description: "ID du post signalé (optionnel)" },
          reportedCommentId: { type: "string", description: "ID du commentaire signalé (optionnel)" },
          reportedUserId: { type: "string", description: "ID de l'utilisateur signalé (optionnel)" },
          reason: {
            type: "string",
            enum: ["spam", "harassment", "inappropriate", "hate", "violence", "disinfo", "illegal", "fraud", "other"],
            description: "Motif du signalement",
          },
          description: { type: "string", description: "Description complémentaire" },
        },
      },
      response: {
        201: { ...S.success, description: "Signalement créé" },
        401: { ...S.error, description: "Non authentifié" },
      },
    },
  }, async (req, reply) => {
    try {
      const { reportedPostId, reportedCommentId, reportedUserId, reason, description } = req.body;
      const report = await Report.create({
        reportedPost: reportedPostId,
        reportedComment: reportedCommentId,
        reportedUser: reportedUserId,
        reporter: req.user.id,
        reason,
        description,
      });
      return successResponse(reply, report, "Rapport créé", 201);
    } catch (err) {
      return errorResponse(reply, "Erreur", 500);
    }
  });

  fastify.get("/", {
    onRequest: [fastify.authenticate],
    schema: {
      tags: ["Reports"],
      summary: "Lister tous les signalements [Admin]",
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
                  status: { type: "string", enum: ["pending", "reviewed", "resolved"] },
                  reason: { type: "string" },
                  description: { type: "string" },
                  reporter: { type: "object", properties: { username: { type: "string" } } },
                  reportedPost: {
                    type: "object",
                    properties: {
                      _id: { type: "string" },
                      content: { type: "string" },
                      image: { type: "string" },
                      author: { type: "object", properties: { _id: { type: "string" }, username: { type: "string" } } },
                    },
                  },
                  reportedComment: {
                    type: "object",
                    properties: {
                      _id: { type: "string" },
                      content: { type: "string" },
                      author: { type: "object", properties: { _id: { type: "string" }, username: { type: "string" } } },
                    },
                  },
                  reportedUser: {
                    type: "object",
                    properties: { username: { type: "string" }, email: { type: "string" } },
                  },
                  createdAt: { type: "string", format: "date-time" },
                },
              },
            },
          },
        },
        403: { ...S.error, description: "Non autorisé (rôle admin requis)" },
      },
    },
  }, async (req, reply) => {
    try {
      if (req.user.role !== "admin") return errorResponse(reply, "Non autorisé", 403);
      const reports = await Report.find()
        .populate({ path: "reportedPost", select: "content image author", populate: { path: "author", select: "username _id" } })
        .populate({ path: "reportedComment", select: "content author", populate: { path: "author", select: "username _id" } })
        .populate("reportedUser", "username email")
        .populate("reporter", "username")
        .sort({ createdAt: -1 });
      return successResponse(reply, reports);
    } catch (err) {
      return errorResponse(reply, "Erreur", 500);
    }
  });

  fastify.patch("/:id", {
    onRequest: [fastify.authenticate],
    schema: {
      tags: ["Reports"],
      summary: "Mettre à jour le statut d'un signalement [Admin]",
      security: [{ bearerAuth: [] }],
      params: S.idParam,
      body: {
        type: "object",
        required: ["status"],
        properties: {
          status: { type: "string", enum: ["pending", "reviewed", "resolved"] },
        },
      },
      response: {
        200: { ...S.success, description: "Signalement mis à jour" },
        403: { ...S.error, description: "Non autorisé" },
      },
    },
  }, async (req, reply) => {
    try {
      if (req.user.role !== "admin") return errorResponse(reply, "Non autorisé", 403);
      const { status } = req.body;
      const report = await Report.findByIdAndUpdate(req.params.id, { status }, { new: true });
      return successResponse(reply, report, "Rapport mis à jour");
    } catch (err) {
      return errorResponse(reply, "Erreur", 500);
    }
  });
};
