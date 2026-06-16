const User = require("../models/User");
const bcrypt = require("bcryptjs");
const successResponse = require("../utils/successResponse");
const errorResponse = require("../utils/errorResponse");

exports.register = async (req, reply) => {
  try {
    const { username, email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return errorResponse(reply, "Nom d'utilisateur ou email déjà utilisé", 409);
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword
    });

    return successResponse(reply, { id: user._id, email: user.email }, "Utilisateur créé", 201);
  } catch (err) {
    return errorResponse(reply, "Erreur serveur lors de l'inscription", 500);
  }
};

exports.login = async (req, reply) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    // Vérification de l'existence et du mot de passe
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return errorResponse(reply, "Email ou mot de passe incorrect", 401);
    }

    // Génération du token JWT (via le plugin fastify-jwt)
    const token = reply.jwtSign({ id: user._id, role: user.role });

    return successResponse(reply, { token, user: { username: user.username, role: user.role } }, "Connexion réussie");
  } catch (err) {
    return errorResponse(reply, "Erreur lors de la connexion", 500);
  }
};