const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  courseName: { type: String, required: true },
  videoPaths: [{ type: String, required: true }],
  pdfPaths: [{ type: String, required: true }],
  uploadDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Course", courseSchema);