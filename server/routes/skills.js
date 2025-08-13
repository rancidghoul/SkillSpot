const express = require('express');
const router = express.Router();
const Skill = require('../models/Skill');
const auth = require('../middleware/auth');

// GET /api/skills - Get all skills (protected)
router.get('/', auth, async (req, res) => {
  try {
    const skills = await Skill.find({ userId: req.user._id });
    res.json({ success: true, data: skills });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/skills - Add new skill (protected)
router.post('/', auth, async (req, res) => {
  try {
    const { skill, proficiency } = req.body;
    
    // Validate input
    if (!skill || !skill.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Skill name is required' 
      });
    }
    
    if (!proficiency || !Array.isArray(proficiency) || proficiency.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'At least one proficiency entry is required' 
      });
    }
    
    // Check if skill already exists for this user
    const existingSkill = await Skill.findOne({ 
      userId: req.user._id, 
      skill: skill.trim() 
    });
    
    if (existingSkill) {
      return res.status(400).json({ 
        success: false, 
        message: 'A skill with this name already exists' 
      });
    }
    
    const newSkill = new Skill({ 
      userId: req.user._id, 
      skill: skill.trim(), 
      proficiency 
    });
    
    await newSkill.save();
    res.status(201).json({ success: true, data: newSkill });
  } catch (err) {
    console.error('Add skill error:', err);
    
    // Handle duplicate key errors
    if (err.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: 'A skill with this name already exists' 
      });
    }
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ 
        success: false, 
        message: messages.join(', ') 
      });
    }
    
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT /api/skills/:id - Update skill (protected)
router.put('/:id', auth, async (req, res) => {
  try {
    const { skill, proficiency } = req.body;
    
    // Validate input
    if (!skill || !skill.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Skill name is required' 
      });
    }
    
    if (!proficiency || !Array.isArray(proficiency) || proficiency.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'At least one proficiency entry is required' 
      });
    }
    
    // Check if skill name already exists for this user (excluding current skill)
    const existingSkill = await Skill.findOne({ 
      userId: req.user._id, 
      skill: skill.trim(),
      _id: { $ne: req.params.id }
    });
    
    if (existingSkill) {
      return res.status(400).json({ 
        success: false, 
        message: 'A skill with this name already exists' 
      });
    }
    
    const updatedSkill = await Skill.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { skill: skill.trim(), proficiency },
      { new: true, runValidators: true }
    );
    
    if (!updatedSkill) {
      return res.status(404).json({ success: false, message: 'Skill not found' });
    }
    
    res.json({ success: true, data: updatedSkill });
  } catch (err) {
    console.error('Update skill error:', err);
    
    // Handle duplicate key errors
    if (err.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: 'A skill with this name already exists' 
      });
    }
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ 
        success: false, 
        message: messages.join(', ') 
      });
    }
    
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE /api/skills/:id - Delete skill (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const deletedSkill = await Skill.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user._id 
    });
    
    if (!deletedSkill) {
      return res.status(404).json({ success: false, message: 'Skill not found' });
    }
    
    res.json({ success: true, message: 'Skill deleted successfully' });
  } catch (err) {
    console.error('Delete skill error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/skills/:userId - Get skills for a specific user (public for portfolio)
router.get('/:userId', async (req, res) => {
  try {
    const skills = await Skill.find({ userId: req.params.userId });
    res.json({ success: true, data: skills });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router; 