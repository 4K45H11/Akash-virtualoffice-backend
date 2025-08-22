// routes/file.route.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const File = require('../models/File.model');
const { verifyToken } = require('../middleware/auth.middle');

// ensure uploads folder exists
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

// multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${unique}${ext}`);
  }
});

const upload = multer({ storage });

// Upload file (authenticated)
router.post('/upload', verifyToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: 'No file uploaded' });

    const fileDoc = new File({
      filename: req.file.filename,
      originalName: req.file.originalname,
      uploader: req.user.email || req.user.name || 'unknown',
      teamId: req.body.teamId || null
    });

    await fileDoc.save();
    res.status(201).json(fileDoc);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// List files (optionally filter by team)
router.get('/', verifyToken, async (req, res) => {
  try {
    const teamId = req.query.teamId || null;
    const filter = {};
    if (teamId) filter.teamId = teamId;
    // optionally limit recent files
    const files = await File.find(filter).sort({ uploadDate: -1 }).limit(200);
    res.json(files);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Download by id
router.get('/:id/download', verifyToken, async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ msg: 'File not found' });

    const filePath = path.join(UPLOAD_DIR, file.filename);
    if (!fs.existsSync(filePath)) return res.status(404).json({ msg: 'File missing on server' });

    res.download(filePath, file.originalName);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
