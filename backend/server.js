require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// User schema and model
const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "student" },
  enrollments: [{
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    enrollmentDate: { type: Date, default: Date.now },
    progress: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
  }],
});

const User = mongoose.model("User", userSchema);

// Admin schema and model
const adminSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "admin" },
});

const Admin = mongoose.model("Admin", adminSchema);

// Course schema and model
const courseSchema = new mongoose.Schema({
  courseName: { type: String, required: true },
  courseDescription: { type: String, required: true },
  coursePrice: { type: Number, required: true },
  videoPaths: [{ type: String, required: true }],
  pdfPaths: [{ type: String, required: true }],
  comments: [{
    user: { type: String, required: true },
    text: { type: String, required: true },
    date: { type: Date, default: Date.now }
  }],
  uploadDate: { type: Date, default: Date.now },
});

const Course = mongoose.model("Course", courseSchema);

// ActiveTime schema and model
const activeTimeSchema = new mongoose.Schema({
  email: { type: String, required: true },
  date: { type: Date, required: true },
  minutes: { type: Number, required: true },
});

const ActiveTime = mongoose.model("ActiveTime", activeTimeSchema);

// Verify upload directories exist
const createUploadDirectories = () => {
  const videoDir = path.join(__dirname, "uploads/videos");
  const pdfDir = path.join(__dirname, "uploads/pdfs");
  if (!fs.existsSync(videoDir)) {
    fs.mkdirSync(videoDir, { recursive: true });
  }
  if (!fs.existsSync(pdfDir)) {
    fs.mkdirSync(pdfDir, { recursive: true });
  }
};

createUploadDirectories();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith("video")) {
      cb(null, "uploads/videos");
    } else if ( file.mimetype === "application/pdf") {
      cb(null, "uploads/pdfs");
    }
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${path.basename(file.originalname)}`);
  },
});

const upload = multer({ storage: storage });

// Signup route for students
app.post("/student-signup", async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      role: "student",
    });

    await newUser.save();
    res.status(201).json({ message: "Signup successful!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
});

// Admin signup route
app.post("/admin-signup", async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = new Admin({
      fullName,
      email,
      password: hashedPassword,
      role: "admin",
    });

    await newAdmin.save();
    res.status(201).json({ message: "Signup successful!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
});

// Sign-in route for students
app.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.status(200).json({ message: "Sign-in successful", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
});

// Admin login route
app.post("/admin-login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Error during admin login:", error);
    res.status(500).json({ message: "An error occurred" });
  }
});

// Upload route
app.post("/upload", upload.fields([{ name: "videos" }, { name: "pdfs" }]), async (req, res) => {
  const { courseName, courseDescription, coursePrice } = req.body;

  if (!req.files || !req.files.videos || !req.files.pdfs) {
    return res.status(400).json({ message: "Both video and PDF files are required." });
  }

  const videoPaths = req.files.videos.map(file => file.filename);
  const pdfPaths = req.files.pdfs.map(file => file.filename);

  try {
    const newCourse = new Course({
      courseName,
      courseDescription,
      coursePrice,
      videoPaths,
      pdfPaths,
    });

    await newCourse.save();
    res.status(201).json({ message: "Files uploaded successfully!" });
  } catch (error) {
    console.error("Error saving course:", error);
    res.status(500).json({ message: "An error occurred during file upload." });
  }
});

// Route to get all available courses
app.get("/courses", async (req, res) => {
  try {
    const courses = await Course.find({});
    res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "An error occurred while fetching courses." });
  }
});

// Route to get a specific course by ID
app.get("/courses/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ message: "An error occurred while fetching the course." });
  }
});

// Route to serve video files
app.get("/videos/:filename", (req, res) => {
  const { filename } = req.params;
  const videoPath = path.join(__dirname, "uploads/videos", filename);
  if (fs.existsSync(videoPath)) {
    res.sendFile(videoPath);
  } else {
    res.status(404).json({ message: "Video file not found" });
  }
});

// Route to serve PDF files
app.get("/pdfs/:filename", (req, res) => {
  const { filename } = req.params;
  const pdfPath = path.join(__dirname, "uploads/pdfs", filename);
  if (fs.existsSync(pdfPath)) {
    res.sendFile(pdfPath);
  } else {
    res.status(404).json({ message: "PDF file not found" });
  }
});

// Route to add a comment to a course
app.post("/courses/:id/comments", async (req, res) => {
  const { id } = req.params;
  const { user, text } = req.body;

  try {
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    course.comments.push({ user, text });
    await course.save();

    res.status(201).json(course);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "An error occurred while adding the comment." });
  }
});

// Route to get admin dashboard data
app.get("/admin-dashboard", async (req, res) => {
  try {
    const courses = await Course.find({});
    const coursesUploaded = courses.length;

    // Get the count of students enrolled in courses
    const users = await User.find({});
    let coursesEnrolledByStudent = 0;
    users.forEach(user => {
      coursesEnrolledByStudent += user.enrollments.length;
    });

    // Mock data for the rest of the fields
    const chartData = [
      { day: 'Monday', hours: 2 },
      { day: 'Tuesday', hours: 3 },
      { day: 'Wednesday', hours: 4 },
      { day: 'Thursday', hours: 1 },
      { day: 'Friday', hours: 5 },
    ];
    const hoursLearning = "10h 30m"; // Replace with real data
    const profile = { name: "Admin", email: "admin@example.com", mobile: "1234567890" };

    res.status(200).json({
      chartData,
      coursesUploaded,
      coursesEnrolledByStudent,
      hoursLearning,
      profile,
      courses
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while fetching dashboard data." });
  }
});

// Delete course route
app.delete("/delete-course/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Course.findByIdAndDelete(id);
    res.status(200).json({ message: "Course deleted successfully!" });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ message: "An error occurred while deleting the course." });
  }
});

// Route to get video upload counts by day
app.get("/video-uploads-by-day", async (req, res) => {
  try {
    const videoUploads = await Course.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$uploadDate" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    res.status(200).json(videoUploads);
  } catch (error) {
    console.error("Error fetching video uploads by day:", error);
    res.status(500).json({ message: "An error occurred while fetching video uploads by day." });
  }
});

// Route to get student dashboard data
app.get("/student-dashboard", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.query.email }).populate('enrollments.courseId');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      enrollments: user.enrollments,
      profile: { name: user.fullName, email: user.email }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to get active time per day for a student
app.get("/student/active-time", async (req, res) => {
  try {
    const email = req.query.email;
    const activeTimes = await ActiveTime.find({ email }).sort({ date: 1 });
    res.status(200).json(activeTimes);
  } catch (error) {
    console.error("Error fetching active time:", error);
    res.status(500).json({ message: "An error occurred while fetching active time." });
  }
});

// Serving uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Starting the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});