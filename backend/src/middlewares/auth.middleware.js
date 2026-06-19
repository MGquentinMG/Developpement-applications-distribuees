module.exports = async function (fastify) {
  fastify.decorate("authenticate", async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      return reply.status(401).send({
        success: false,
        message: "Non autorisé : Token invalide ou absent"
      });
    }
  });
};