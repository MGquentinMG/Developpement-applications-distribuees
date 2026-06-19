const successResponse = (reply, data, message = "Succès", statusCode = 200) => {
  return reply.status(statusCode).send({
    success: true,
    message,
    data,
  });
};

module.exports = successResponse;