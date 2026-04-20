// models/Question.js
const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  title: String,
  description: String,
  user: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Question", questionSchema);