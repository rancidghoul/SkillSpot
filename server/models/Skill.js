const mongoose = require('mongoose');

const proficiencySchema = new mongoose.Schema({
  date: { type: Date, required: true },
  level: { type: Number, required: true, min: 1, max: 5 },
}, { _id: false });

const skillSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  skill: { 
    type: String, 
    required: true,
    trim: true,
    minlength: 1
  },
  proficiency: { 
    type: [proficiencySchema], 
    default: [],
    validate: {
      validator: function(v) {
        return v.length > 0;
      },
      message: 'At least one proficiency entry is required'
    }
  },
}, { 
  timestamps: true 
});

// Create a compound unique index for userId + skill to prevent duplicates
skillSchema.index({ userId: 1, skill: 1 }, { unique: true });

// Add pre-save middleware to handle duplicate key errors
skillSchema.pre('save', function(next) {
  // Ensure skill name is trimmed and not empty
  if (this.skill) {
    this.skill = this.skill.trim();
  }
  
  // Ensure proficiency entries have valid data
  if (this.proficiency && this.proficiency.length > 0) {
    this.proficiency = this.proficiency.filter(prof => 
      prof.date && prof.level && prof.level >= 1 && prof.level <= 5
    );
  }
  
  next();
});

// Add static method to handle duplicate key errors
skillSchema.statics.handleDuplicateError = function(error) {
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0];
    if (field === 'userId') {
      throw new Error('User not found');
    } else if (field === 'skill') {
      throw new Error('A skill with this name already exists');
    } else {
      throw new Error('Duplicate entry found');
    }
  }
  throw error;
};

module.exports = mongoose.model('Skill', skillSchema); 