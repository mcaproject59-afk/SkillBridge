const express = require("express");
const router = express.Router();


const Lecture = require("../models/Lecture");
const Progress = require("../models/Progress");

// 🔥 ADD THIS
const {
  createCourse,
  getAllCourses,
  getCourseById
} = require("../controllers/courseControllers");


// ==========================================
// 📌 0. COURSE APIs (NEW)
// ==========================================

// ➕ Create Course
router.post("/create", createCourse);

// 📥 Get All Courses (for Explore page)
router.get("/", getAllCourses);

// 📄 Get Course by ID
router.get("/course/:id", getCourseById);


// ==========================================
// 📌 1. GET ALL LECTURES OF A COURSE
// ==========================================
router.get("/lectures/:courseId", async (req, res) => {
  try {
    const lectures = await Lecture.find({
      courseId: req.params.courseId
    }).sort({ createdAt: 1 });

    res.json(lectures);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error fetching lectures"
    });
  }
});


// ==========================================
// 📌 2. SAVE / UPDATE PROGRESS
// ==========================================
router.post("/progress", async (req, res) => {
  try {
    const {
      userId,
      courseId,
      lectureId,
      watchedSeconds,
      totalSeconds
    } = req.body;

    if (!userId || !courseId || !lectureId) {
      return res.status(400).json({
        message: "Missing required fields"
      });
    }

    const progress = await Progress.findOneAndUpdate(
      { userId, lectureId },
      {
        courseId,
        watchedSeconds,
        totalSeconds
      },
      {
        upsert: true,
        new: true
      }
    );

    res.json({
      success: true,
      progress
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error saving progress"
    });
  }
});


// ==========================================
// 📌 3. GET PROGRESS OF A COURSE
// ==========================================
router.get("/progress/:userId/:courseId", async (req, res) => {
  try {
    const { userId, courseId } = req.params;

    const progress = await Progress.find({
      userId,
      courseId
    });

    res.json(progress);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error fetching progress"
    });
  }
});

module.exports = router;