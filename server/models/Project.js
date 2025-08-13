const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: { type: [String], default: [] },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  link: { type: String },
  image: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema); 