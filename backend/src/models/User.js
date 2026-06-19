const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    age: {
      type: Number,
      required: true
    },

    

    role: {
      type: String,
      enum: ["user", "moderator", "admin"],
      default: "user"
    },

    bio: String,

    avatar: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", UserSchema);