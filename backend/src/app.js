const path = require("path");
const Fastify = require("fastify");

const app = Fastify({ logger: true });

// 1. Swagger (avant les routes)
app.register(require("@fastify/swagger"), {
  openapi: {
    info: {
      title: "Breezy API",
      description: "API REST du réseau social Breezy — JWT requis via Authorization: Bearer <token>",
      version: "1.0.0",
    },
    servers: [{ url: "http://localhost/api", description: "Via nginx (port 80)" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
});

app.register(require("@fastify/swagger-ui"), {
  routePrefix: "/docs",
  uiConfig: { docExpansion: "list", deepLinking: true },
  staticCSP: true,
});

// 2. Plugins de base
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

// 3. JWT via Vault
app.register(require("./plugins/jwt_plugin"));

// 4. Routes
app.register(require("./routes/auth.routes"), { prefix: "/api/auth" });
app.register(require("./routes/users.routes"), { prefix: "/api/users" });
app.register(require("./routes/posts.routes"), { prefix: "/api/posts" });
app.register(require("./routes/comments.routes"), { prefix: "/api/comments" });
app.register(require("./routes/messages.routes"), { prefix: "/api/messages" });
app.register(require("./routes/upload.routes"), { prefix: "/api/upload" });
app.register(require("./routes/notifications.routes"), { prefix: "/api/notifications" });
app.register(require("./routes/moderation.routes"), { prefix: "/api/moderation" });
app.register(require("./routes/reports.routes"), { prefix: "/api/reports" });

// 5. Gestionnaire d'erreurs
app.setErrorHandler((error, request, reply) => {
  request.log.error(error);
  reply.status(error.statusCode || 500).send({
    success: false,
    message: error.message || "Erreur interne du serveur"
  });
});

module.exports = app;