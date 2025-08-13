import React from 'react';
import JobMatchBoard from '../components/JobMatchBoard';

const JobMatches = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Job Matches</h1>
        <p className="text-gray-600 mt-2">
          Discover opportunities that match your skills and experience.
        </p>
      </div>

      {/* Job Matching Board */}
      <JobMatchBoard />
    </div>
  );
};

export default JobMatches; 