const mongoose = require("mongoose");

const teacherVerificationSchema = new mongoose.Schema(
  {
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    fullName: { type: String, required: true },

    subject: { type: String, required: true },

    qualification: { type: String, required: true },

    experienceYears: { type: Number, required: true },

    resume: { type: String, required: true },

    certificates: [{ type: String }],

    // ✅ STATUS (lowercase everywhere)
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    // ✅ LEVEL APPROVED BY ADMIN
    levelApproved: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: null,
    },
  },
  { timestamps: true }
);

// ✅ UNIQUE COMBINATION (no duplicate subject per teacher)
teacherVerificationSchema.index(
  { teacherId: 1, subject: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "TeacherVerification",
  teacherVerificationSchema
);