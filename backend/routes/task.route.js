const express = require('express');
const router = express.Router();
const Task = require('../models/Task.model');
const { verifyToken } = require('../middleware/auth.middle');

// Create task (Team Lead)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, description, assignedTo } = req.body;
    const task = new Task({
      title,
      description,
      assignedTo,
      assignedBy: req.user.email
    });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Get all tasks (Team Lead or Intern)
router.get('/', verifyToken, async (req, res) => {
  try {
    let tasks;
    if (req.user.role === 'Intern') {
      tasks = await Task.find({ assignedTo: req.user.email });
    } else {
      tasks = await Task.find();
    }
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
