const path = require("path");
const Fastify = require("fastify");

const app = Fastify({ logger: true });

// 1. Plugins de base
app.register(require("@fastify/cors"), {
  origin: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});
app.register(require("@fastify/helmet"), { crossOriginResourcePolicy: false });
app.register(require("@fastify/multipart"), { limits: { fileSize: 5 * 1024 * 1024 } });
app.register(require("@fastify/static"), {
  root: path.join(__dirname, "../uploads"),
  prefix: "/uploads/",
});

// 2. Configuration JWT
app.register(require("@fastify/jwt"), {
  secret: process.env.JWT_SECRET
});

// 3. Middlewares
app.decorate("authenticate", async (request, reply) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    return reply.status(401).send({
      success: false,
      message: "Non autorisé : Token invalide ou absent"
    });
  }
});

// 4. Routes
app.register(require("./routes/auth.routes"), { prefix: "/api/auth" });
app.register(require("./routes/users.routes"), { prefix: "/api/users" });
app.register(require("./routes/posts.routes"), { prefix: "/api/posts" });
app.register(require("./routes/comments.routes"), { prefix: "/api/comments" });
app.register(require("./routes/messages.routes"), { prefix: "/api/messages" });
app.register(require("./routes/upload.routes"), { prefix: "/api/upload" });
app.register(require("./routes/notifications.routes"), { prefix: "/api/notifications" });
app.register(require("./routes/moderation.routes"), { prefix: "/api/moderation" });
app.register(require("./routes/reports.routes"), { prefix: "/api/reports" }); // ⭐ AJOUTER

// 5. Gestionnaire d'erreurs
app.setErrorHandler((error, request, reply) => {
  request.log.error(error);
  reply.status(error.statusCode || 500).send({
    success: false,
    message: error.message || "Erreur interne du serveur"
  });
});

module.exports = app;