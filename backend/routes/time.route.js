// routes/time.route.js
const express = require('express');
const router = express.Router();
const TimeTracking = require('../models/TimeTracking.model');
const { verifyToken } = require('../middleware/auth.middle');
// Start timer: body { taskId }
router.post('/start', verifyToken, async (req, res) => {
  try {
    const { taskId } = req.body;
    if (!taskId) return res.status(400).json({ msg: 'taskId required' });

    // Optionally prevent double-start by same user for same task (allow multiple entries but here we create)
    const entry = new TimeTracking({
      taskId,
      userEmail: req.user.email,
      startTime: new Date()
    });
    await entry.save();
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Stop timer: body { entryId } OR { taskId } (we'll support entryId preferred)
router.post('/stop', verifyToken, async (req, res) => {
  try {
    const { entryId, taskId } = req.body;
    let entry;
    if (entryId) {
      entry = await TimeTracking.findById(entryId);
    } else if (taskId) {
      // find latest open entry for user & task
      entry = await TimeTracking.findOne({ taskId, userEmail: req.user.email, endTime: null }).sort({ startTime: -1 });
    } else {
      return res.status(400).json({ msg: 'entryId or taskId required' });
    }

    if (!entry) return res.status(404).json({ msg: 'Active time entry not found' });
    if (entry.userEmail !== req.user.email) return res.status(403).json({ msg: 'Not authorized' });

    entry.endTime = new Date();
    entry.durationSec = Math.round((entry.endTime - entry.startTime) / 1000);
    await entry.save();
    res.json(entry);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Get total tracked time for a task (for this user)
router.get('/task/:taskId', verifyToken, async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const userEmail = req.user.email;
    const entries = await TimeTracking.find({ taskId, userEmail, durationSec: { $exists: true } });

    const totalSec = entries.reduce((acc, e) => acc + (e.durationSec || 0), 0);
    res.json({ taskId, userEmail, totalSec, entries });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
