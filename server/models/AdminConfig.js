const mongoose = require("mongoose");

const adminConfigSchema = new mongoose.Schema({
  approvedSubjects: [
    {
      teacherId: String,
      subjects: [String]
    }
  ],
  allowedLevels: [String]
});

module.exports = mongoose.model("AdminConfig", adminConfigSchema);