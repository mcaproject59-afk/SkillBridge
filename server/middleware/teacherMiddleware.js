const teacherOnly = (req, res, next) => {
  try {
    // ✅ Must be logged in
    if (!req.user) {
      return res.status(401).json({
        message: "Not authenticated"
      });
    }

    // ✅ Must be teacher
    if (req.user.role !== "teacher") {
      return res.status(403).json({
        message: "Only teachers can create courses"
      });
    }

    // ✅ Must be verified by admin
    if (!req.user.isVerifiedTeacher) {
      return res.status(403).json({
        message: "You are not verified by admin yet"
      });
    }

    next();

  } catch (error) {
    res.status(500).json({
      message: "Authorization error"
    });
  }
};

module.exports = teacherOnly;