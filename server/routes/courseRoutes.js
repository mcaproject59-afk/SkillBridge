const express = require("express");
const router = express.Router();

const Course = require("../models/Course");
const Progress = require("../models/Progress");
const {uploadVideo, uploadPdf} = require("../middleware/upload");

//controllers
const { createCourse,getAllCourses,getTeacherCourses } = require("../controllers/courseControllers");
const { UploadVideo } = require("../../client/src/utils/upload");



// ==============================
// 📌 COURSE CORE APIs
// ==============================

// ➕ Create Course
router.post("/create", createCourse);

// 📥 Get all courses
router.get("/", getAllCourses);
// ==============================
// 📌 GET TEACHER COURSES
// ==============================
router.get("/teacher/:teacherId", async (req, res) => {
  try {
    const courses = await Course.find({
      createdBy: req.params.teacherId,
    });

    res.json(courses);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching teacher courses" });
  }
});
router.get("/teacher/:teacherId", getTeacherCourses);
// 🗑️ DELETE COURSE 
router.delete("/:id", async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: "Course deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});
// ✏️ UPDATE COURSE (ADD HERE)
router.put("/:id", async (req, res) => {
  try {
    const updated = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});
// ==============================
// ✅ GET COURSE BY NAME (FIXED)
// ==============================
router.get("/course/name/:courseName", async (req, res) => {
  try {
    const { courseName } = req.params;

    const course = await Course.findOne({
      title: { $regex: new RegExp(`^${courseName}$`, "i") },
    });

    // ✅ IMPORTANT: return null if not found (NO ERROR)
    if (!course) {
      return res.json(null);
    }

    res.json(course);
  } catch (err) {
    console.error("Course fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ==============================
// 📌 GET COURSE BY ID (OPTIONAL)
// ==============================
router.get("/course/id/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(course);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching course" });
  }
});

// ==============================
// 🎥 ADD VIDEO (TEXT URL)
// ==============================
router.post("/:id/add-video", async (req, res) => {
  try {
    const { title, videoUrl } = req.body;

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    course.videos.push({
      title,
      videoUrl,
      likes: 0,
    });

    await course.save();

    res.json({ success: true, course });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding video" });
  }
});

// ==============================
// 🎥 UPLOAD VIDEO FILE
// ==============================
router.post("/:id/upload-video", uploadVideo.single("video"), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const videoUrl = `/uploads/${req.file.filename}`;

    course.videos.push({
      title: req.body.title,
      videoUrl,
      likes: 0,
    });

    await course.save();

    res.json({ success: true, course });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Video upload failed" });
  }
});

// ==============================
// 📄 UPLOAD PDF
// ==============================
router.post("/:id/upload-pdf", uploadPdf.single("pdf"), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const pdfUrl = `/uploads/${req.file.filename}`;

    course.pdfs.push({
      title: req.body.title,
      pdfUrl,
      likes: 0,
    });

    await course.save();

    res.json({ success: true, course });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "PDF upload failed" });
  }
});

// ==============================
// 📤 SUBMIT COURSE
// ==============================
router.put("/:id/submit", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    course.status = "pending";
    await course.save();

    res.json({
      success: true,
      message: "Course submitted",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error submitting course" });
  }
});

// ==============================
// 📌 ADMIN ROUTES
// ==============================

router.get("/admin/courses/pending", async (req, res) => {
  try {
    const courses = await Course.find({ status: "pending" });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: "Error fetching pending courses" });
  }
});

router.put("/admin/courses/:id/approve", async (req, res) => {
  try {
    await Course.findByIdAndUpdate(req.params.id, {
      status: "approved",
    });

    res.json({ message: "Course approved" });
  } catch (err) {
    res.status(500).json({ message: "Error approving course" });
  }
});

router.put("/admin/courses/:id/reject", async (req, res) => {
  try {
    await Course.findByIdAndUpdate(req.params.id, {
      status: "rejected",
    });

    res.json({ message: "Course rejected" });
  } catch (err) {
    res.status(500).json({ message: "Error rejecting course" });
  }
});

// ==============================
// 👍 LIKE VIDEO
// ==============================
router.put("/like/video", async (req, res) => {
  try {
    const { courseId, videoIndex } = req.body;

    const course = await Course.findById(courseId);

    if (!course || !course.videos[videoIndex]) {
      return res.status(404).json({ message: "Video not found" });
    }

    course.videos[videoIndex].likes =
      (course.videos[videoIndex].likes || 0) + 1;

    await course.save();

    res.json(course);
  } catch (err) {
    res.status(500).json({ message: "Error liking video" });
  }
});

// ==============================
// 👍 LIKE PDF
// ==============================
router.put("/like/pdf", async (req, res) => {
  try {
    const { courseId, pdfIndex } = req.body;

    const course = await Course.findById(courseId);

    if (!course || !course.pdfs[pdfIndex]) {
      return res.status(404).json({ message: "PDF not found" });
    }

    course.pdfs[pdfIndex].likes =
      (course.pdfs[pdfIndex].likes || 0) + 1;

    await course.save();

    res.json(course);
  } catch (err) {
    res.status(500).json({ message: "Error liking PDF" });
  }
});

// ==============================
// 📊 PROGRESS SYSTEM
// ==============================
router.post("/progress", async (req, res) => {
  try {
    const { userId, courseId, lectureId, watchedSeconds, totalSeconds } =
      req.body;

    if (!userId || !courseId || !lectureId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const progress = await Progress.findOneAndUpdate(
      { userId, lectureId },
      {
        courseId,
        watchedSeconds,
        totalSeconds,
      },
      { upsert: true, new: true }
    );

    res.json({ success: true, progress });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving progress" });
  }
});

router.get("/progress/:userId/:courseId", async (req, res) => {
  try {
    const { userId, courseId } = req.params;

    const progress = await Progress.find({ userId, courseId });

    res.json(progress);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching progress" });
  }
});

module.exports = router;