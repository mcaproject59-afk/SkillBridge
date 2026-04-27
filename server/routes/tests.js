const express = require("express");
const router = express.Router();
const Question = require("../models/Question");

// ✅ GET /api/tests/generate
router.get("/generate", async (req, res) => {
  try {
    const { subject, level } = req.query;

    const questions = await Question.find({ subject, level });

    if (questions.length === 0) {
      return res.json([]);
      // return res.status(404).json({
      //   message: `No questions found for ${subject} - ${level}`
      // });
    }

    // ✅ 🔥 THIS IS THE LINE YOU ASKED ABOUT
    res.json(questions);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;