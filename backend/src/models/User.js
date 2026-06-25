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

    avatar: String,

    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    status: {
      type: String,
      enum: ["pending", "active"],
      default: "active"
    },

    banned: {
      type: Boolean,
      default: false
    },

    banReason: String,

    tags: [String],

    mustChangePassword: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", UserSchema);