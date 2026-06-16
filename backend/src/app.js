const Fastify = require("fastify");

const app = Fastify({ logger: true });

// 1. Plugins de base (Sécurité)
app.register(require("@fastify/cors"));
app.register(require("@fastify/helmet"));

// 2. Configuration JWT
app.register(require("@fastify/jwt"), {
  secret: process.env.JWT_SECRET
});

// 3. Décorateurs / Middlewares (Enregistré ici, il sera disponible pour les routes suivantes)
app.register(require("./middlewares/authMiddleware"));

// 4. Routes (L'ordre n'a pas d'importance entre elles)
app.register(require("./routes/auth.routes"), { prefix: "/api/auth" });
app.register(require("./routes/user.routes"), { prefix: "/api/users" }); 

// 5. Gestionnaire d'erreurs (DOIT être tout à la fin)
app.setErrorHandler((error, request, reply) => {
  request.log.error(error);
  reply.status(error.statusCode || 500).send({
    success: false,
    message: error.message || "Erreur interne du serveur"
  });
});

module.exports = app;