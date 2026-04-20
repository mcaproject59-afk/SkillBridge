const express = require("express");
const router = express.Router();
const { registerUser, loginUser,getUserById } = require("../controllers/authController");
const User = require("../models/User");
const multer = require("multer");
const path = require("path");
// ==============================
// 📌 MULTER SETUP
// ==============================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// ================= REGISTER & LOGIN =================
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/user/:id", getUserById);
// ==============================
// 📌 UPLOAD PROFILE IMAGE
// ==============================
router.put("/upload-profile/:id", upload.single("profileImage"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.profileImage = req.file.filename;
    await user.save();

    res.json({
      message: "Profile image updated",
      profileImage: user.profileImage
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed" });
  }
});


// ================= GET USER PROFILE =================
router.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
      joinDate: user.createdAt,
      profileImage: user.profileImage
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;