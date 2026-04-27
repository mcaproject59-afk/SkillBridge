const express = require("express");
const router = express.Router();

const Answer = require("../models/Answer");
const CommunityQuestion = require("../models/CommunityQuestion");

// =======================================
// ✅ ADD QUESTION
// =======================================
router.post("/questions", async (req, res) => {
  try {
    console.log("POST QUESTION HIT");
    console.log("BODY:", req.body);

    const { title, description, user } = req.body;

    const newQuestion = new CommunityQuestion({
      title,
      description,
      user,
    });

    const savedQuestion = await newQuestion.save();

    res.status(201).json(savedQuestion);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to add question" });
  }
});

// =======================================
// ✅ GET ALL QUESTIONS
// =======================================
router.get("/questions", async (req, res) => {
  try {
    console.log("GET QUESTIONS HIT");

    const questions = await CommunityQuestion.find().sort({ createdAt: -1 });

    console.log("QUESTIONS:", questions);

    res.json(questions);
  } catch (err) {
    console.error("ERROR:", err); // 🔥 VERY IMPORTANT
    res.status(500).json({ error: err.message });
  }
});

// =======================================
// ✅ ADD ANSWER
// =======================================
router.post("/answers", async (req, res) => {
  try {
    console.log("ADD ANSWER HIT");
    console.log("BODY:", req.body);
    const { questionId, answer, user, userRole } = req.body;

    const newAnswer = new Answer({
      questionId,
      answer,
      user,
      userRole,
    });

    await newAnswer.save();

    res.status(201).json({ message: "Answer added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add answer" });
  }
});

// =======================================
// ✅ GET ANSWERS BY QUESTION ID
// =======================================
router.get("/answers/:questionId", async (req, res) => {
  try {
    const answers = await Answer.find({
      questionId: req.params.questionId,
    }).sort({ createdAt: -1 });

    res.json(answers);
  } catch (err) {
    res.status(500).json({ error: "Error fetching answers" });
  }
});

// =======================================
// ✅ LIKE ANSWER
// =======================================
router.put("/answers/:answerId/like", async (req, res) => {
  try {
    const updated = await Answer.findByIdAndUpdate(
      req.params.answerId,
      { $inc: { likes: 1 } },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Error liking answer" });
  }
});

module.exports = router;