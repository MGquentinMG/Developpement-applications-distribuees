"use strict";

const bcrypt = require("bcryptjs");
const User = require("./models/User");

const ADMIN_EMAIL    = "admin@exemple.com";
const ADMIN_USERNAME = "Admin";

/**
 * Crée le compte admin au premier démarrage si il n'existe pas encore.
 *
 * Mot de passe : variable d'environnement ADMIN_PASSWORD (défaut : "Admin1234!")
 * mustChangePassword = true → l'app demandera de le modifier à la première connexion.
 */
async function seedAdminUser() {
  try {
    const existing = await User.findOne({ email: ADMIN_EMAIL });

    if (existing) {
      console.log(`[seed] Compte admin déjà présent (${ADMIN_EMAIL})`);
      return;
    }

    const rawPassword     = process.env.ADMIN_PASSWORD || "Admin1234!";
    const isDefaultPwd    = !process.env.ADMIN_PASSWORD;
    const hashedPassword  = await bcrypt.hash(rawPassword, 10);

    await User.create({
      username:           ADMIN_USERNAME,
      email:              ADMIN_EMAIL,
      password:           hashedPassword,
      age:                25,
      role:               "admin",
      status:             "active",
      banned:             false,
      mustChangePassword: true,
    });

    if (isDefaultPwd) {
      console.warn(
        "[seed] ⚠️  Mot de passe admin par défaut utilisé : Admin1234!\n" +
        "        Définissez ADMIN_PASSWORD dans docker-compose.yml en production."
      );
    }

    console.log(
      `[seed] ✅ Compte admin créé → email: ${ADMIN_EMAIL} | user: ${ADMIN_USERNAME} | mdp: ${rawPassword}`
    );
  } catch (err) {
    console.error("[seed] Erreur lors de la création du compte admin :", err.message);
  }
}

module.exports = seedAdminUser;
