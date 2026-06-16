require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/database");

const start = async () => {
  try {
    await connectDB();

    await app.listen({
      port: process.env.PORT || 5000,
      host: "0.0.0.0"
    });

    console.log("Serveur démarré");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();