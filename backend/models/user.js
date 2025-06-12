const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "student" },
  coursesInProgress: { type: Number, default: 0 },
  coursesCompleted: { type: Number, default: 0 },
  hoursLearning: { type: String, default: "0h 0m" },
  myCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
});

module.exports = mongoose.model("User", userSchema);