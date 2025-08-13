import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ResumePDF from '../components/ResumePDF';
import api from '../utils/api';

const PublicPortfolio = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch user, skills, and projects for the given userId
        const [userRes, skillsRes, projectsRes] = await Promise.all([
          api.get(`/api/users/${userId}`),
          api.get(`/api/skills/${userId}`),
          api.get(`/api/projects/${userId}`)
        ]);
        // User data may be under user or data depending on backend
        const user = userRes.data.user || userRes.data.data || userRes.data;
        setUserData(user);
        setSkills(skillsRes.data.data || []);
        setProjects(projectsRes.data.data || []);
      } catch (err) {
        setError('Failed to load portfolio data');
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolioData();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error</p>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <ResumePDF 
        userData={userData}
        skills={skills}
        projects={projects}
      />
    </div>
  );
};

export default PublicPortfolio; 