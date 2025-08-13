const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const auth = require('../middleware/auth');

// GET /api/projects - Get all projects (protected)
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user._id });
    res.json({ success: true, data: projects });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/projects - Add new project (protected)
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, tags, startDate, endDate, link, image } = req.body;
    const newProject = new Project({ 
      userId: req.user._id, 
      title, 
      description, 
      tags, 
      startDate, 
      endDate, 
      link, 
      image 
    });
    await newProject.save();
    res.status(201).json({ success: true, data: newProject });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT /api/projects/:id - Update project (protected)
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, tags, startDate, endDate, link, image } = req.body;
    const updatedProject = await Project.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { title, description, tags, startDate, endDate, link, image },
      { new: true }
    );
    
    if (!updatedProject) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    
    res.json({ success: true, data: updatedProject });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE /api/projects/:id - Delete project (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const deletedProject = await Project.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user._id 
    });
    
    if (!deletedProject) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/projects/:userId - Get projects for a specific user (public for portfolio)
router.get('/:userId', async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.params.userId });
    res.json({ success: true, data: projects });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router; 