const express = require("express");
const router = express.Router();
const TeacherVerification = require("../models/TeacherVerification");
const User = require("../models/User");


// ==========================================
// 📊 ADMIN DASHBOARD STATS (NEW)
// ==========================================
router.get("/stats", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const approvedCount = await TeacherVerification.countDocuments({
      status: "approved"
    });

    const rejectedCount = await TeacherVerification.countDocuments({
      status: "rejected"
    });

    const pendingCount = await TeacherVerification.countDocuments({
      status: "pending"
    });

    res.json({
      totalUsers,
      approvedCount,
      rejectedCount,
      pendingCount
    });

  } catch (error) {
    console.error("Stats Error:", error);
    res.status(500).json({ message: "Error fetching stats" });
  }
});


// ==========================================
// 📌 GET ALL APPLICATIONS (BETTER)
// ==========================================
router.get("/all", async (req, res) => {
  try {
    const applications = await TeacherVerification.find()
      .populate("teacherId", "fullName email");

    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching applications" });
  }
});


// ==========================================
// 📌 GET ONLY PENDING
// ==========================================
router.get("/pending", async (req, res) => {
  try {
    const applications = await TeacherVerification.find({ status: "pending" })
      .populate("teacherId", "fullName email");

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching applications" });
  }
});


// ==========================================
// ✅ APPROVE (SUBJECT-WISE)
// ==========================================
router.put("/approve/:id", async (req, res) => {
  try {
    const { level } = req.body;

    if (!level || !["beginner", "intermediate", "advanced"].includes(level)) {
      return res.status(400).json({ message: "Valid level required" });
    }

    const request = await TeacherVerification.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    const formattedLevel =
      level.charAt(0).toUpperCase() + level.slice(1);

    request.status = "approved";
    request.levelApproved = formattedLevel;

    await request.save();

    const user = await User.findById(request.teacherId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isTeacher = true;
    user.teacherLevel = formattedLevel;

    await user.save();

    res.json({ message: "Teacher approved successfully" });

  } catch (err) {
    console.error("🔥 FULL ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


// ==========================================
// ❌ REJECT (SUBJECT-WISE)
// ==========================================
router.put("/reject/:id", async (req, res) => {
  try {
    const verification = await TeacherVerification.findById(req.params.id);

    if (!verification) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (verification.status === "rejected") {
      return res.status(400).json({ message: "Already rejected" });
    }

    verification.status = "rejected";

    await verification.save();

    res.json({
      success: true,
      message: "Subject rejected successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error rejecting teacher" });
  }
});

module.exports = router;