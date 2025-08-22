const express = require("express");
const Attendance = require("../models/Attendence.model");
const { verifyToken, restrictTo } = require("../middleware/auth.middle");

const router = express.Router();

// ✅ Mark attendance
router.post("/mark", verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    const userEmail = req.user.email; // from JWT
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Prevent duplicate attendance
    const existing = await Attendance.findOne({ userEmail, date: today });
    if (existing) {
      return res.status(400).json({ msg: "Attendance already marked for today" });
    }

    const attendance = new Attendance({
      userEmail,
      date: today,
      status,
    });

    await attendance.save();
    res.json({ msg: "Attendance marked", attendance });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ✅ Get my attendance history
router.get("/me", verifyToken, async (req, res) => {
  try {
    const userEmail = req.user.email;
    const records = await Attendance.find({ userEmail }).sort({ date: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ✅ HR/Founder → view all attendance
router.get("/all", verifyToken, restrictTo("HR", "Founder"), async (req, res) => {
  try {
    const records = await Attendance.find().sort({ date: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
