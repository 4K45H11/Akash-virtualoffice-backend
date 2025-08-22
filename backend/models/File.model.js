const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true },       // stored filename (on disk)
  originalName: { type: String, required: true },   // uploaded original name
  uploader: { type: String, required: true },       // uploader email or name
  teamId: { type: String, default: null },          // optional
  uploadDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('File', fileSchema);
