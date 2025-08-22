// models/TimeTracking.model.js
const mongoose = require('mongoose');

const timeSchema = new mongoose.Schema({
  taskId: { type: String, required: true },
  userEmail: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date }, // null until stopped
  durationSec: { type: Number } // in seconds, filled when stopped
}, { timestamps: true });

module.exports = mongoose.model('TimeTracking', timeSchema);
