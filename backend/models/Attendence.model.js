const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ["present", "absent"], required: true }
});

// TTL Index → automatically delete records after 30 days
attendanceSchema.index({ date: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

module.exports = mongoose.model("Attendance", attendanceSchema);
