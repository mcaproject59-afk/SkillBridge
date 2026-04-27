const express = require("express");
const router = express.Router();
const Question = require("../models/Question");

// ✅ ADD THIS (AI)
const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


// ==============================
// ➕ POST QUESTION (unchanged)
// ==============================
router.post("/", async (req, res) => {
  try {
    console.log("BODY:", req.body);
    const badWords = ["badword1", "badword2"];

    const isAbusive = badWords.some(word =>
      req.body.description?.toLowerCase().includes(word)
    );

    if (isAbusive) {
      return res.status(400).json({ msg: "Inappropriate content not allowed" });
    }
const q = new Question({
      question: req.body.title,
      description: req.body.description,
      options: [],
      answer: "",
      subject: "Community",
      level: "General",
      user: req.body.user
    });

    await q.save();
    res.json(q);

  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});
// 🔥 BULK INSERT QUESTIONS
router.post("/bulk", async (req, res) => {
  try {
    const questions = await Question.insertMany(req.body);
    res.json(questions);
  } catch (error) {
    console.error("BULK ERROR:",error);
    res.status(500).json({ message: error.message });
  }
});


// ==============================
// 📥 GET ALL QUESTIONS
// ==============================
router.get("/", async (req, res) => {
  const questions = await Question.find().sort({ createdAt: -1 });
  res.json(questions);
});


// // ==============================
// // 🤖 AI GENERATE QUESTIONS
// // ==============================
// router.get("/generate", async (req, res) => {
//   try {
//     const { subject, level } = req.query;

//     console.log("FILTER:", subject, level); // debug

//     // ✅ FILTER PROPERLY
//     const questions = await Question.find({
//       subject: subject,
//       level: level
//     });

//     // ❌ if nothing found → show error (no mixing)
//     if (!questions.length) {
//       return res.status(404).json({
//         message: `No questions found for ${subject} - ${level}`
//       });
//     }

//     // ✅ Shuffle
//     questions.sort(() => Math.random() - 0.5);

//     // ✅ Limit to 5
//     questions = questions.slice(0, 5);

//     res.json(questions);

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server Error" });
//   }
// });

// ==============================
// 📌 GET QUESTION BY ID (KEEP LAST)
// ==============================
router.get("/:id", async (req, res) => {
  const question = await Question.findById(req.params.id);
  res.json(question);
});


module.exports = router;