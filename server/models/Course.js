const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    description: {
      type: String
    },

    subject: {
      type: String
    },

    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"]
    },

    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    creditsRequired: {
      type: Number,
      default: 0
    },

    resources: [
      {
        type: {
          type: String // video / pdf
        },
        title: String,
        url: String
      }
    ],

    studentsEnrolled: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    averageRating: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);