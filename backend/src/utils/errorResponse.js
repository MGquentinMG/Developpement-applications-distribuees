const errorResponse = (reply, message = "Une erreur est survenue", statusCode = 500) => {
  return reply.status(statusCode).send({
    success: false,
    error: message,
  });
};

module.exports = errorResponse;