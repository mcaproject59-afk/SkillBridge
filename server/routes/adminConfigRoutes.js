const express = require("express");
const router = express.Router();
const AdminConfig = require("../models/AdminConfig");
const TeacherVerification = require("../models/TeacherVerification");

// ==========================================
// 👉 GET GLOBAL CONFIG (optional)
// ==========================================
router.get("/config", async (req, res) => {
  try {
    let config = await AdminConfig.findOne();

    if (!config) {
      return res.json({ allowedSubjects: [], allowedLevels: [] });
    }

    res.json({
      allowedSubjects: config.allowedSubjects || [],
      allowedLevels: config.allowedLevels || [],
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// 👉 GET APPROVED SUBJECTS FOR TEACHER
// ==========================================
router.get("/config/:teacherId", async (req, res) => {
  try {
    const { teacherId } = req.params;

    const approved = await TeacherVerification.find({
      teacherId,
      status: "approved",
    });

    const subjects = approved.map((item) => item.subject);
    const levels = approved.map((item) => item.levelApproved);

    res.json({
      subjects,
      levels,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// ➕ ADD SUBJECT (GLOBAL)
// ==========================================
router.post("/add-subject", async (req, res) => {
  try {
    let { subject } = req.body;

    if (!subject || subject.trim() === "") {
      return res.status(400).json({ message: "Subject is required" });
    }

    subject = subject.trim();

    let config = await AdminConfig.findOne();
    if (!config) config = await AdminConfig.create({});

    if (!config.allowedSubjects) config.allowedSubjects = [];

    if (!config.allowedSubjects.includes(subject)) {
      config.allowedSubjects.push(subject);
    }

    await config.save();
    res.json(config);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// ➕ ADD LEVEL
// ==========================================
router.post("/add-level", async (req, res) => {
  try {
    let { level } = req.body;

    if (!level || level.trim() === "") {
      return res.status(400).json({ message: "Level is required" });
    }

    level = level.trim();

    let config = await AdminConfig.findOne();
    if (!config) config = await AdminConfig.create({});

    if (!config.allowedLevels) config.allowedLevels = [];

    if (!config.allowedLevels.includes(level)) {
      config.allowedLevels.push(level);
    }

    await config.save();
    res.json(config);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// ✏️ UPDATE SUBJECTS
// ==========================================
router.put("/subjects", async (req, res) => {
  try {
    const { allowedSubjects } = req.body;

    const config = await AdminConfig.findOneAndUpdate(
      {},
      { allowedSubjects: allowedSubjects || [] },
      { new: true, upsert: true }
    );

    res.json(config);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// ✏️ UPDATE LEVELS
// ==========================================
router.put("/levels", async (req, res) => {
  try {
    const { allowedLevels } = req.body;

    const config = await AdminConfig.findOneAndUpdate(
      {},
      { allowedLevels: allowedLevels || [] },
      { new: true, upsert: true }
    );

    res.json(config);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;