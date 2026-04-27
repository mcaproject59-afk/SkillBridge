  const express = require("express");
  const router = express.Router();
  const Answer = require("../models/Answer");

  // ➕ Add Answer
  router.post("/", async (req, res) => {
        const badWords = ["badword1", "badword2"];

    const isAbusive = badWords.some(word =>
      req.body.answer?.toLowerCase().includes(word)
    );

    if (isAbusive) {
      return res.status(400).json({ msg: "Inappropriate content not allowed" });
    }

    const a = new Answer(req.body);
    await a.save();
    res.json(a);
  });

  // 📥 Get Answers for a Question
  router.get("/:id", async (req, res) => {
    const answers = await Answer.find({ questionId: req.params.id });
    res.json(answers);
  });

  // 👍 Like Answer  ✅ (PUT YOUR CODE HERE)
  router.put("/:id/like", async (req, res) => {
    const ans = await Answer.findById(req.params.id);
    ans.likes += 1;
    await ans.save();
    res.json(ans);
  });

  module.exports = router;