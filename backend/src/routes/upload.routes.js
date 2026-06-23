const path = require("path");
const fs = require("fs");
const { pipeline } = require("stream/promises");
const successResponse = require("../utils/successResponse");
const errorResponse = require("../utils/errorResponse");

const UPLOADS_DIR = path.join(__dirname, "../../uploads");

module.exports = async function (fastify, opts) {
  fastify.post("/image", { onRequest: [fastify.authenticate] }, async (req, reply) => {
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
