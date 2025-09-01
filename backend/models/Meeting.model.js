const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema({
  host: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  meetingCode: { type: String, required: true, unique: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: () => Date.now() + 24 * 60 * 60 * 1000 } // 1-day expiry
});

module.exports = mongoose.model("Meeting", meetingSchema);
