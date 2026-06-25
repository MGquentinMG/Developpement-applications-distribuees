const path = require("path");
const fs = require("fs");
const { pipeline } = require("stream/promises");
const successResponse = require("../utils/successResponse");
const errorResponse = require("../utils/errorResponse");

const UPLOADS_DIR = path.join(__dirname, "../../uploads");

module.exports = async function (fastify, opts) {
  fastify.post("/image", {
    onRequest: [fastify.authenticate],
    schema: {
      tags: ["Upload"],
      summary: "Uploader une image (jpg, jpeg, png, gif, webp — max 5 Mo)",
      security: [{ bearerAuth: [] }],
      consumes: ["multipart/form-data"],
      body: {
        type: "object",
        properties: {
          file: { type: "string", format: "binary", description: "Fichier image" },
        },
      },
      response: {
        201: {
          type: "object",
          description: "Image uploadée",
          properties: {
            success: { type: "boolean" },
            message: { type: "string" },
            data: {
              type: "object",
              properties: {
                url: { type: "string", description: "URL publique de l'image (ex: /uploads/filename.jpg)" },
              },
            },
          },
        },
        400: {
          type: "object",
          properties: { success: { type: "boolean" }, message: { type: "string" } },
          description: "Aucun fichier ou format non supporté",
        },
      },
    },
  }, async (req, reply) => {
    try {
      const data = await req.file();
      if (!data) return errorResponse(reply, "Aucun fichier reçu", 400);

      const ext = path.extname(data.filename).toLowerCase();
      const allowed = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
      if (!allowed.includes(ext)) {
        return errorResponse(reply, "Format non supporté", 400);
      }

      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
      const dest = path.join(UPLOADS_DIR, filename);

      await pipeline(data.file, fs.createWriteStream(dest));

      const url = `/uploads/${filename}`;
      return successResponse(reply, { url }, "Image uploadée", 201);
    } catch (err) {
      return errorResponse(reply, "Erreur lors de l'upload", 500);
    }
  });
};
