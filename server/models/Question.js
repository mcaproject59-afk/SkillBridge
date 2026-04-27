// models/Question.js
const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    required: true
  },
  answer: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  level: {
    type: String,
    required: true
  }
}, { timestamps: true });


module.exports = mongoose.model("Question", questionSchema);