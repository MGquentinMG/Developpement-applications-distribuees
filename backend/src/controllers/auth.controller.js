exports.register = async (request, reply) => {
  reply.send({
    message: "Register"
  });
};

exports.login = async (request, reply) => {
  reply.send({
    message: "Login"
  });
};