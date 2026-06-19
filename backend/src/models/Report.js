const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema(
  {
    reportedPost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post"
    },

    reportedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    reason: {
      type: String,
      enum: ["spam", "harassment", "inappropriate", "other"],
      required: true
    },

    description: String,

    status: {
      type: String,
      enum: ["pending", "reviewed", "resolved"],
      default: "pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", ReportSchema);