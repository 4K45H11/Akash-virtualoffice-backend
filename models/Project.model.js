const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true
  },
  description: String,
  assignedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  startDate: {
    type: Date,
    default: Date.now
  },
  deadline: Date,
  status: {
    type: String,
    enum: ["ongoing", "completed", "pending"],
    default: "ongoing"
  }
});

module.exports = mongoose.model("Project", projectSchema);
