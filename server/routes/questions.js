// routes/questions.js
const express = require("express");
const router = express.Router();
const Question = require("../models/Question");

// ➕ POST QUESTION
router.post("/", async (req, res) => {
  try {
    const badWords = ["badword1", "badword2"];

    const isAbusive = badWords.some(word =>
      req.body.description?.toLowerCase().includes(word)
    );

    if (isAbusive) {
      return res.status(400).json({ msg: "Inappropriate content not allowed" });
    }

    const q = new Question(req.body);
    await q.save();
    res.json(q);

  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});


// 📥 GET ALL QUESTIONS
router.get("/", async (req, res) => {
  const questions = await Question.find().sort({ createdAt: -1 });
  res.json(questions);
});


// 🔥 ADD THIS EXACTLY HERE (VERY IMPORTANT)
router.get("/:id", async (req, res) => {
  const question = await Question.findById(req.params.id);
  res.json(question);
});


module.exports = router;