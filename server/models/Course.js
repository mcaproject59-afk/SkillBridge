const mongoose = require("mongoose");

// ==============================
// 📌 VIDEO SCHEMA
// ==============================
const videoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    videoUrl: { type: String, required: true },
    likes:{
      type: Number,
      default: 0
    },
  },
  { timestamps: true }
);

// ==============================
// 📌 PDF SCHEMA
// ==============================
const pdfSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    pdfUrl: { type: String, required: true },
    likes:{
      type: Number,
      default: 0
    },
  },
  { timestamps: true }
);

// ==============================
// 📌 LIVE CLASS SCHEMA
// ==============================
const liveSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    link: { type: String, required: true },
    scheduledAt: { type: Date },
  },
  { timestamps: true }
);

// ==============================
// 📌 COURSE SCHEMA
// ==============================
const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    description: String,

    subject: String,

    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      required: true,
    },

    // 👇 REAL TEACHER LINK
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 📌 CONTENT STRUCTURE
    videos: [videoSchema],
    pdfs: [pdfSchema],
    liveClasses: [liveSchema],

    // 📌 APPROVAL SYSTEM
    status: {
      type: String,
      enum: ["draft", "pending", "approved", "rejected"],
      default: "draft",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);