module.exports = async function (fastify) {
  fastify.decorate("authenticate", async (request, reply) => {
    try {
      // Le plugin fastify-jwt ajoute automatiquement la méthode jwtVerify()
      await request.jwtVerify();
    } catch (err) {
      // En cas d'erreur (token invalide ou absent), on renvoie une erreur
      return reply.status(401).send({
        success: false,
        message: "Non autorisé : Token invalide ou absent"
      });
    }
  });
};