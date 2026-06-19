const joi = require('joi');
const errorResponse = require("../utils/errorResponse");

const validateRegister = async (request, reply) => {
  const schema = joi.object({
    username: joi.string().alphanum().min(3).max(30).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
    age: joi.number().min(15).max(120).required(),
  });

  try {
    await schema.validateAsync(request.body);
  } catch (err) {
    return errorResponse(reply, err.details[0].message, 400);
  }
};

const validateLogin = async (request, reply) => {
  const schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
  });

  try {
    await schema.validateAsync(request.body);
  } catch (err) {
    return errorResponse(reply, err.details[0].message, 400);
  }
};

module.exports = { validateRegister, validateLogin };