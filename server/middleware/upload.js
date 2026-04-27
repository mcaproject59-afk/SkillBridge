const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// ===============================
// 📁 VIDEO STORAGE (Cloudinary)
// ===============================
const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "skillbridge/videos",
    resource_type: "video",
    allowed_formats: ["mp4", "mkv", "webm"],
  },
});

// ===============================
// 📁 PDF STORAGE (Cloudinary)
// ===============================
const pdfStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "skillbridge/pdfs",
    resource_type: "raw",
    allowed_formats: ["pdf"],
  },
});

// ===============================
// 📤 Upload handlers
// ===============================
const uploadVideo = multer({ storage: videoStorage });
const uploadPdf = multer({ storage: pdfStorage });

// ===============================
// 📦 EXPORT
// ===============================
module.exports = {
  uploadVideo,
  uploadPdf,
};