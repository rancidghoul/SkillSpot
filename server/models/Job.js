const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  tags: { type: [String], default: [] },
  location: { type: String, required: true },
  salary: { type: String },
  description: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema); 