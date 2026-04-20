const express = require("express");
const router = express.Router();
const Progress = require("../models/Progress");

// ==========================================
// 📊 CHECK LEVEL ACCESS
// ==========================================
router.get("/check-access/:userId/:subject/:level", async (req, res) => {
  try {
    const { userId, subject, level } = req.params;

    const progress = await Progress.findOne({ userId, subject });

    // ✅ Beginner always allowed
    if (level === "beginner") {
      return res.json({ allowed: true });
    }

    // 🔒 Intermediate needs beginner test
    if (level === "intermediate") {
      if (progress?.beginnerPassed) {
        return res.json({ allowed: true });
      } else {
        return res.json({
          allowed: false,
          message: "Pass Beginner Test to unlock Intermediate"
        });
      }
    }

    // 🔒 Advanced needs intermediate test
    if (level === "advanced") {
      if (progress?.intermediatePassed) {
        return res.json({ allowed: true });
      } else {
        return res.json({
          allowed: false,
          message: "Pass Intermediate Test to unlock Advanced"
        });
      }
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error checking access" });
  }
});


// ==========================================
// ✅ UPDATE TEST RESULT (PASS)
// ==========================================
router.post("/update", async (req, res) => {
  try {
    const { userId, subject, level } = req.body;

    let progress = await Progress.findOne({ userId, subject });

    if (!progress) {
      progress = new Progress({ userId, subject });
    }

    if (level === "beginner") {
      progress.beginnerPassed = true;
    }

    if (level === "intermediate") {
      progress.intermediatePassed = true;
    }

    await progress.save();

    res.json({ success: true, message: "Progress updated" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating progress" });
  }
});

module.exports = router;