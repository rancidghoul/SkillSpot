import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import SkillGraph from '../components/SkillGraph';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

// Color palette for different skills
const colorPalette = [
  '#3b82f6', // Blue
  '#10b981', // Green
  '#8b5cf6', // Purple
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#06b6d4', // Cyan
  '#84cc16', // Lime
  '#f97316', // Orange
  '#ec4899', // Pink
  '#6366f1', // Indigo
  '#14b8a6', // Teal
  '#f43f5e', // Rose
];

// Generate a color for each skill
const generateSkillColors = (skills) => {
  const colors = {};
  skills.forEach((skill, index) => {
    colors[skill.skill] = colorPalette[index % colorPalette.length];
  });
  return colors;
};

const Skills = () => {
  const { user } = useAuth();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [form, setForm] = useState({ skill: '', proficiency: [{ date: '', level: 1 }] });
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState(null);

  // Generate colors for skills
  const skillColors = generateSkillColors(skills);

  // Fetch skills on mount
  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/api/skills');
      setSkills(res.data.data);
    } catch (err) {
      setError('Failed to load skills');
    } finally {
      setLoading(false);
    }
  };

  // Add new skill
  const handleAddSkill = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!form.skill.trim()) {
      setError('Skill name is required');
      return;
    }
    
    if (!form.proficiency || form.proficiency.length === 0) {
      setError('At least one proficiency entry is required');
      return;
    }
    
    // Validate proficiency entries
    for (let i = 0; i < form.proficiency.length; i++) {
      const prof = form.proficiency[i];
      if (!prof.date || !prof.level) {
        setError('All proficiency entries must have both date and level');
        return;
      }
    }
    
    setAdding(true);
    setError('');
    try {
      // Format the data for the API
      const skillData = {
        skill: form.skill.trim(),
        proficiency: form.proficiency.map(prof => ({
          date: prof.date,
          level: parseInt(prof.level)
        }))
      };
      
      const res = await api.post('/api/skills', skillData);
      setSkills((prev) => [...prev, res.data.data]);
      setShowForm(false);
      resetForm();
    } catch (err) {
      console.error('Add skill error:', err);
      setError(err.response?.data?.message || 'Failed to add skill');
    } finally {
      setAdding(false);
    }
  };

  // Edit skill
  const handleEditSkill = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!form.skill.trim()) {
      setError('Skill name is required');
      return;
    }
    
    if (!form.proficiency || form.proficiency.length === 0) {
      setError('At least one proficiency entry is required');
      return;
    }
    
    // Validate proficiency entries
    for (let i = 0; i < form.proficiency.length; i++) {
      const prof = form.proficiency[i];
      if (!prof.date || !prof.level) {
        setError('All proficiency entries must have both date and level');
        return;
      }
    }
    
    setAdding(true);
    setError('');
    try {
      // Format the data for the API
      const skillData = {
        skill: form.skill.trim(),
        proficiency: form.proficiency.map(prof => ({
          date: prof.date,
          level: parseInt(prof.level)
        }))
      };
      
      const res = await api.put(`/api/skills/${editingSkill._id}`, skillData);
      setSkills((prev) => prev.map(skill => 
        skill._id === editingSkill._id ? res.data.data : skill
      ));
      setShowForm(false);
      setEditingSkill(null);
      resetForm();
    } catch (err) {
      console.error('Edit skill error:', err);
      setError(err.response?.data?.message || 'Failed to update skill');
    } finally {
      setAdding(false);
    }
  };

  // Delete skill
  const handleDeleteSkill = async (skillId) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) return;
    
    setDeleting(skillId);
    setError('');
    try {
      await api.delete(`/api/skills/${skillId}`);
      setSkills((prev) => prev.filter(skill => skill._id !== skillId));
    } catch (err) {
      setError('Failed to delete skill');
    } finally {
      setDeleting(null);
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    setForm({ skill: '', proficiency: [{ date: '', level: 1 }] });
    setError('');
  };

  // Open form for adding new skill
  const openAddForm = () => {
    setEditingSkill(null);
    resetForm();
    setShowForm(true);
  };

  // Open edit form
  const openEditForm = (skill) => {
    setEditingSkill(skill);
    setForm({
      skill: skill.skill,
      proficiency: skill.proficiency && skill.proficiency.length > 0 
        ? skill.proficiency 
        : [{ date: '', level: 1 }]
    });
    setShowForm(true);
  };

  // Close form
  const closeForm = () => {
    setShowForm(false);
    setEditingSkill(null);
    resetForm();
  };

  // Helper for proficiency input
  const handleProficiencyChange = (idx, field, value) => {
    setForm((prev) => {
      const prof = [...(prev.proficiency || [])];
      prof[idx] = { ...prof[idx], [field]: value };
      return { ...prev, proficiency: prof };
    });
  };

  const addProficiencyRow = () => {
    setForm((prev) => ({ 
      ...prev, 
      proficiency: [...(prev.proficiency || []), { date: '', level: 1 }] 
    }));
  };

  const removeProficiencyRow = (idx) => {
    setForm((prev) => {
      const newProficiency = prev.proficiency.filter((_, i) => i !== idx);
      // Ensure there's always at least one row
      if (newProficiency.length === 0) {
        newProficiency.push({ date: '', level: 1 });
      }
      return { ...prev, proficiency: newProficiency };
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Skills</h1>
          <p className="text-gray-600 mt-2">
            Track and visualize your skill progression over time.
          </p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={openAddForm}>
          <Plus className="w-4 h-4" />
          Add Skill
        </button>
      </div>

      {/* Add/Edit Skill Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <form className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full relative animate-fade-in" onSubmit={editingSkill ? handleEditSkill : handleAddSkill}>
            <button type="button" className="absolute top-3 right-3 text-gray-400 hover:text-gray-700" onClick={closeForm}>
              ×
            </button>
            <h2 className="text-xl font-bold mb-4">{editingSkill ? 'Edit Skill' : 'Add New Skill'}</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Skill Name</label>
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2"
                value={form.skill}
                onChange={e => setForm(f => ({ ...f, skill: e.target.value }))}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Proficiency Over Time</label>
              {form.proficiency && form.proficiency.map((p, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input
                    type="date"
                    className="border rounded px-2 py-1"
                    value={p.date}
                    onChange={e => handleProficiencyChange(idx, 'date', e.target.value)}
                    required
                  />
                  <input
                    type="number"
                    min={1}
                    max={5}
                    className="border rounded px-2 py-1 w-20"
                    value={p.level}
                    onChange={e => handleProficiencyChange(idx, 'level', parseInt(e.target.value))}
                    required
                  />
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => removeProficiencyRow(idx)}
                  >
                    ×
                  </button>
                </div>
              ))}
              <button type="button" className="btn-secondary mt-2" onClick={addProficiencyRow}>
                + Add Row
              </button>
            </div>
            <button type="submit" className="btn-primary w-full" disabled={adding}>
              {adding ? (editingSkill ? 'Updating...' : 'Adding...') : (editingSkill ? 'Update Skill' : 'Add Skill')}
            </button>
            {error && <div className="text-red-600 mt-2">{error}</div>}
          </form>
        </div>
      )}

      {/* Skill Graph */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Skill Progression Graph</h2>
        <SkillGraph data={skills} />
      </div>

      {/* Skills List */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Skills</h2>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading skills...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="text-red-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading skills</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
                <button 
                  onClick={fetchSkills}
                  className="mt-2 text-sm text-red-800 hover:text-red-900 underline"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {skills.length === 0 && (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-2">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <p className="text-gray-500">No skills found. Add your first skill to get started!</p>
              </div>
            )}
            {skills.map((skill) => (
              <div 
                key={skill._id} 
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border-l-4"
                style={{ borderLeftColor: skillColors[skill.skill] }}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: skillColors[skill.skill] }}
                    ></div>
                    <h3 className="font-medium text-gray-900">{skill.skill}</h3>
                  </div>
                  <div className="ml-6 space-y-2">
                    <p className="text-sm text-gray-600">{skill.proficiency.length} proficiency points</p>
                    {skill.proficiency.length > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${(skill.proficiency[skill.proficiency.length-1].level / 5) * 100}%`,
                              backgroundColor: skillColors[skill.skill]
                            }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500 w-8 text-right">
                          {skill.proficiency[skill.proficiency.length-1].level}/5
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {skill.proficiency.length > 0 ? `Lv ${skill.proficiency[skill.proficiency.length-1].level}` : 'N/A'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {skill.proficiency.length > 0 ? `Updated ${new Date(skill.proficiency[skill.proficiency.length-1].date).toLocaleDateString()}` : ''}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditForm(skill)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Edit skill"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteSkill(skill._id)}
                      disabled={deleting === skill._id}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                      title="Delete skill"
                    >
                      {deleting === skill._id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Skills; 