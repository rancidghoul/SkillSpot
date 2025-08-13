import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, BarChart3, FileText, User, Star, Code } from 'lucide-react';

const features = [
  {
    icon: <BarChart3 className="w-7 h-7 text-blue-500" />,
    title: 'Skill Graphs',
    desc: 'Visualize your skills and growth with interactive graphs.'
  },
  {
    icon: <Briefcase className="w-7 h-7 text-purple-500" />,
    title: 'Job Matching',
    desc: 'Get matched with jobs that fit your unique skillset.'
  },
  {
    icon: <FileText className="w-7 h-7 text-green-500" />,
    title: 'Resume Export',
    desc: 'Export your resume as a beautiful PDF in one click.'
  },
  {
    icon: <User className="w-7 h-7 text-pink-500" />,
    title: 'Public Portfolio',
    desc: 'Showcase your work and skills with a shareable portfolio.'
  },
  {
    icon: <Star className="w-7 h-7 text-yellow-500" />,
    title: 'Personalized Insights',
    desc: 'Get insights and recommendations tailored to you.'
  },
  {
    icon: <Code className="w-7 h-7 text-indigo-500" />,
    title: 'Project Tracking',
    desc: 'Track your projects and progress over time.'
  },
];

const Home = () => (
  <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-blue-950 to-purple-900">
    {/* Hero Section */}
    <section className="flex-1 flex flex-col justify-center items-center text-center px-4 pt-24 pb-12 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-br from-blue-600/30 via-purple-500/20 to-transparent rounded-full blur-3xl opacity-60 animate-pulse"></div>
      </div>
      <div className="relative z-10">
        <div className="inline-flex items-center gap-3 mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <span className="text-3xl font-extrabold text-white tracking-tight">SkillSpot</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-lg">
          Unlock Your <span className="text-blue-400">Potential</span>
        </h1>
        <p className="text-xl md:text-2xl text-blue-100 mb-8 animate-pulse-slow">
          Build your portfolio, match with jobs, and grow your career—all in one place.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <Link to="/login" className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-lg transition-all duration-200 transform hover:scale-105">
            Login
          </Link>
          <Link to="/register" className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-bold text-lg shadow-lg transition-all duration-200 transform hover:scale-105">
            Register
          </Link>
        </div>
        <div className="flex flex-col items-center mt-8">
          <span className="text-blue-200 text-sm mb-2">Scroll to see features</span>
          <span className="animate-bounce text-blue-300 text-2xl">↓</span>
        </div>
      </div>
    </section>

    {/* Features Section */}
    <section className="relative z-10 max-w-5xl mx-auto px-4 py-12">
      <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-10">Why SkillSpot?</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {features.map((feature, idx) => (
          <div key={idx} className="bg-white/10 border border-blue-900 rounded-2xl p-6 flex flex-col items-center text-center shadow-xl hover:scale-105 hover:bg-white/20 transition-transform duration-200">
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
            <p className="text-blue-100 text-sm">{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>

    <footer className="mt-12 mb-4 text-blue-200 text-center text-sm opacity-80">
      &copy; {new Date().getFullYear()} SkillSpot. All rights reserved.
    </footer>
  </div>
);

export default Home; 