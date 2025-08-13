const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const Skill = require('../models/Skill');

// GET /api/jobs - Get all jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json({ success: true, data: jobs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/jobs - Add a new job
router.post('/', async (req, res) => {
  try {
    const { title, company, tags, location, salary, description } = req.body;
    const newJob = new Job({ title, company, tags, location, salary, description });
    await newJob.save();
    res.status(201).json({ success: true, data: newJob });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// GET /api/jobs/match?userId=... - Get job matches for a user
router.get('/match', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ success: false, message: 'userId is required' });
    const userSkills = await Skill.find({ userId });
    const skillTags = userSkills.map(s => s.skill.toLowerCase());
    const jobs = await Job.find();
    // Calculate match score
    const matches = jobs.map(job => {
      const jobTags = job.tags.map(t => t.toLowerCase());
      const matchedTags = jobTags.filter(tag => skillTags.includes(tag));
      const matchScore = jobTags.length > 0 ? Math.round((matchedTags.length / jobTags.length) * 100) : 0;
      return {
        ...job.toObject(),
        matchScore,
        matchedTags,
      };
    });
    // Sort by matchScore descending
    matches.sort((a, b) => b.matchScore - a.matchScore);
    res.json({ success: true, data: matches });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router; 