require("dotenv").config();
const express = require("express");
const router = express.Router();
const OpenAI = require("openai");

router.post("/", async (req, res) => {
  try {
    const { question } = req.body;

    const msg = question.toLowerCase();

    if (msg.includes("javascript")) {
      return res.json({
        reply: "JavaScript example: let x = 10;"
      });
    }

    if (msg.includes("python")) {
      return res.json({
        reply: "Python example: print('Hello World')"
      });
    }

    if (msg.includes("loop")) {
      return res.json({
        reply: "Loop example:\nfor(let i=0;i<5;i++){ console.log(i); }"
      });
    }

    res.json({
      reply: "This looks like a course-related query. AI upgrade coming soon 🚀"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Server error" });
  }
});

module.exports = router;