const express = require("express");
const router = express.Router();
const { uploadVideo, uploadPdf } = require("../middleware/upload");

// =========================
// 🎥 VIDEO UPLOAD ROUTE
// =========================
router.post("/video", uploadVideo.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No video uploaded" });
  }

  res.json({
    url: req.file.path,
    public_id: req.file.filename,
  });
});

// =========================
// 📄 PDF UPLOAD ROUTE
// =========================
router.post("/pdf", uploadPdf.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No PDF uploaded" });
  }

  res.json({
    url: req.file.path,
    public_id: req.file.filename,
  });
});

module.exports = router;