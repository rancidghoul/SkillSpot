import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Eye, EyeOff, MapPin, Briefcase, BarChart3 } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    title: '',
    location: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      title: formData.title || 'Software Developer',
      location: formData.location || 'San Francisco, CA'
    };

    const result = await register(userData);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-900 via-blue-950 to-purple-900 px-4 relative overflow-hidden">
      {/* Home Icon Button */}
      <div className="absolute top-6 left-6 z-10">
        <Link to="/" className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-blue-900 shadow-lg transition-all">
          <BarChart3 className="w-7 h-7 text-blue-500" />
        </Link>
      </div>
      {/* Glassmorphic Card */}
      <div className="relative z-10 max-w-md w-full bg-white/10 backdrop-blur-lg border border-blue-900 rounded-3xl shadow-2xl p-10 flex flex-col items-center">
        <div className="mb-6 flex flex-col items-center">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-3 shadow-lg">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-1">Create Account</h1>
          <p className="text-blue-100 text-sm mb-2">Register for SkillSpot</p>
        </div>
        {/* ...existing register form fields/buttons... */}
        {/* Place your register form here, styled with Tailwind (inputs, button, etc.) */}
        {/** Example: **/}
        <form className="w-full space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-blue-100 mb-1">Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 w-5 h-5" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 rounded-lg bg-white/20 border border-blue-800 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your name"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-100 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 rounded-lg bg-white/20 border border-blue-800 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-100 mb-1">Job Title</label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 w-5 h-5" />
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 rounded-lg bg-white/20 border border-blue-800 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Software Developer"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-100 mb-1">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 w-5 h-5" />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 rounded-lg bg-white/20 border border-blue-800 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., San Francisco, CA"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-100 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-2 rounded-lg bg-white/20 border border-blue-800 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-100 mb-1">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 w-5 h-5" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-2 rounded-lg bg-white/20 border border-blue-800 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm your password"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-lg shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-60"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <div className="mt-6 text-blue-200 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 hover:underline font-semibold">Login</Link>
        </div>
      </div>
      {/* Animated background shapes */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-blue-600/30 via-purple-500/20 to-transparent rounded-full blur-3xl opacity-60 animate-pulse pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tr from-purple-600/30 via-blue-500/20 to-transparent rounded-full blur-2xl opacity-50 animate-pulse pointer-events-none" />
    </div>
  );
};

export default Register; 