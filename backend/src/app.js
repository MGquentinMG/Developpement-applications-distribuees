const Fastify = require("fastify");

const app = Fastify({ logger: true });

// 1. Plugins de base
app.register(require("@fastify/cors"));
app.register(require("@fastify/helmet"));

// 2. JWT via Vault
app.register(require("./plugins/jwt_plugin"));

// 3. Authenticate est décoré dans jwt_plugin, supprimer le doublon ici

// 4. Routes
app.register(require("./routes/auth.routes"), { prefix: "/api/auth" });
app.register(require("./routes/users.routes"), { prefix: "/api/users" });
app.register(require("./routes/posts.routes"), { prefix: "/api/posts" });
app.register(require("./routes/comments.routes"), { prefix: "/api/comments" });
app.register(require("./routes/messages.routes"), { prefix: "/api/messages" });
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