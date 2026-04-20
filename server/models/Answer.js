// models/Answer.js
const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  questionId: String,
  answer: String,
  user: String,
  userRole: String, // student / teacher
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Answer", answerSchema);