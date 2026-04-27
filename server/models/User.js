const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
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
  phone: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["learner", "teacher"],
    default: "learner"
  },
  isVerified: {
    type: Boolean,
    default:false
  },
  verificationStatus: {
    type: String,
    enum: ["not_applied", "pending", "approved", "rejected"],
    default: "not_applied"
  },
  profileImage: {
    type: String,
    default: ""
  },
  verifiedSubjects:[
  {
    type: String,
  }],

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
