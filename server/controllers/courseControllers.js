const Course = require("../models/Course");

// ================= CREATE COURSE =================
const createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.json(course);
  } catch (err) {
  console.error("CREATE COURSE ERROR:", err); // 
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

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById
};