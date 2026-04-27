const Course = require("../models/Course");

// ================= CREATE COURSE =================
// const createCourse = async (req, res) => {
//   try {
//     const course = await Course.create(req.body);
//     res.json(course);
//   } catch (err) {
//   console.error("CREATE COURSE ERROR:", err); // 
//   res.status(500).json({ message: err.message });
// }
// };
const createCourse = async (req, res) => {
  try {
    const { title, description, subject, level, createdBy } = req.body;

    const course = await Course.create({
      title,
      description,
      subject,
      level,
      createdBy: req.body.createdBy// teacher id
    });

    res.status(201).json(course);
  } catch (err) {
    console.error("CREATE COURSE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// ================= GET ALL COURSES =================
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate("teacherId", "fullName");
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: "Error fetching courses" });
  }
};

// ================= GET COURSE BY ID =================
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: "Error fetching course" });
  }
};
const getTeacherCourses = async (req, res) => {
  try {
    const teacherId = req.params.teacherId;

    const courses = await Course.find({ createdBy: teacherId });

    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: "Error fetching teacher courses" });
  }
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  getTeacherCourses,
};