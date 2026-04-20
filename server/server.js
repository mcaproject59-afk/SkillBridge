const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");

// ✅ ROUTES
const chatbotRoute = require("./routes/chatbot");
const teacherVerificationRoutes = require("./routes/teacherVerification");
const adminVerificationRoutes = require("./routes/adminVerification");
const courseRoutes = require("./routes/courseRoutes");
const authRoutes = require("./routes/authRoutes");
const progressRoutes = require("./routes/progress");
const answersRoutes = require("./routes/answers");
const questionsRoutes = require("./routes/questions");

dotenv.config();
connectDB();

// ✅ CREATE APP ONLY ONCE
const app = express();

// ==============================
// 📌 MIDDLEWARE
// ==============================
app.use(cors());
app.use(express.json()); // 🔥 VERY IMPORTANT

// ==============================
// 📌 ROUTES
// ==============================
app.use("/api/auth", authRoutes);
app.use("/api/teacher-verification", teacherVerificationRoutes);
app.use("/api/chatbot", chatbotRoute);
app.use("/api/admin-verification", adminVerificationRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/answers", answersRoutes);
app.use("/api/questions", questionsRoutes);

// ==============================
// 📌 STATIC FILES
// ==============================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ==============================
// 📌 TEST ROUTE
// ==============================
app.get("/", (req, res) => {
  res.send("API Running...");
});

// ==============================
// 🚀 SERVER START
// ==============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});