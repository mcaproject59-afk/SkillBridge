const express = require("express");
const router = express.Router();
const TeacherVerification = require("../models/TeacherVerification");
const multer = require("multer");
const User = require("../models/User");

// ==============================
// 📌 MULTER SETUP
// ==============================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

// ==============================
// 📌 SUBMIT VERIFICATION (MULTIPLE SUBJECTS)
// ==============================
router.post(
  "/submit",
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "certificates", maxCount: 5 }
  ]),
  async (req, res) => {
    try {
      const { userId, subjects, qualification, experienceYears } = req.body;
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      if (!userId || !subjects || !qualification || !experienceYears)
        return res.status(400).json({ message: "Missing fields" });

      const subjectArray = Array.isArray(subjects) ? subjects : [subjects];
      const resume = req.files["resume"]?.[0]?.filename || "";
      const certificates = req.files["certificates"]
        ? req.files["certificates"].map(file => file.filename)
        : [];

      let created = [];
      let skipped = [];

      for (let subject of subjectArray) {
        try {
          const existing = await TeacherVerification.findOne({
            teacherId: userId,
            subject
          });

          if (existing) {
            skipped.push(subject);
            continue;
          }

          const newVerification = new TeacherVerification({
            teacherId: userId,
            fullName: user.fullName,
            subject,
            qualification,
            experienceYears,
            resume,
            certificates,
            status: "pending"
          });

          await newVerification.save();
          created.push(subject);
        } catch (err) {
          if (err.code === 11000) skipped.push(subject);
          else console.error(err);
        }
      }

      return res.json({ success: true, created, skipped });
    } catch (err) {
      console.error("🔥 ERROR:", err);
      res.status(500).json({ message: "Error submitting verification" });
    }
  }
);

// ==============================
// 📌 GET ALL SUBJECT STATUS
// ==============================
router.get("/status/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId || userId === "undefined")
      return res.status(400).json({ message: "Invalid userId" });

    const verifications = await TeacherVerification.find({ teacherId: userId });

    if (!verifications.length)
      return res.json({ status: "not_applied", subjects: [] });

    res.json({
      status: "multiple",
      subjects: verifications.map(v => ({
        subject: v.subject,
        status: v.status,
        level: v.levelApproved
      }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching status" });
  }
});

// ==============================
// 📌 GET AVAILABLE SUBJECTS
// ==============================
router.get("/available/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const allSubjects = [
      "Python", "Java", "C", "C++", "Django", "SQL", "JavaScript",
      "HTML", "CSS", "Data Structures and Algorithms",
      "Assembly Language", "Software Engineering", "C#", "Linux"
    ];

    const applied = await TeacherVerification.find({ teacherId: userId });
    const appliedSubjects = applied.map(v => v.subject);
    const availableSubjects = allSubjects.filter(
      sub => !appliedSubjects.includes(sub)
    );

    res.json({ availableSubjects });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching available subjects" });
  }
});

module.exports = router;