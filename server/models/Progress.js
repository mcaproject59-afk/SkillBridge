const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  // ==============================
  // 👤 USER INFO
  // ==============================
  userId: {
    type: mongoose.Schema.Types.Mixed,
    ref: "User",
    required: true
  },

  // ==============================
  // 📚 COURSE / SUBJECT
  // ==============================
  courseId: {
    type: String
  },

  subject: {
    type: String,
    required: true
  },

  // ==============================
  // 🎥 VIDEO PROGRESS (EXISTING)
  // ==============================
  lectureId: {
    type: String
  },

  watchedSeconds: {
    type: Number,
    default: 0
  },

  totalSeconds: {
    type: Number,
    default: 0
  },

  // ==============================
  // 🔓 LEVEL UNLOCK SYSTEM (NEW)
  // ==============================
  beginnerPassed: {
    type: Boolean,
    default: false
  },

  intermediatePassed: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

module.exports = mongoose.model("Progress", progressSchema);