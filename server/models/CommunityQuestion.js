const mongoose = require("mongoose");

const communityQuestionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  user: {
    type: String,
    default: "student"
  }
}, { timestamps: true });

module.exports = mongoose.model("CommunityQuestion", communityQuestionSchema);