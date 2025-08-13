import React, { useState, useEffect } from 'react';
import { Calendar, FolderOpen, X, ExternalLink, Image as ImageIcon, Clock, Tag } from 'lucide-react';

function formatDate(dateString) {
  if (!dateString) return 'Ongoing';
  
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function getProjectDuration(startDate, endDate) {
  if (!startDate) return 'Ongoing';
  
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 30) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} month${months !== 1 ? 's' : ''}`;
  } else {
    const years = Math.floor(diffDays / 365);
    return `${years} year${years !== 1 ? 's' : ''}`;
  }
}

function sortProjectsByDate(projects) {
  return [...projects].sort((a, b) => {
    const dateA = new Date(a.startDate || a.createdAt);
    const dateB = new Date(b.startDate || b.createdAt);
    return dateB - dateA; // Most recent first
  });
}

const ProjectTimeline = ({ projects = [] }) => {
  const [selected, setSelected] = useState(null);
  const [sortedProjects, setSortedProjects] = useState([]);

  // Sort projects by date when projects change
  useEffect(() => {
    setSortedProjects(sortProjectsByDate(projects));
  }, [projects]);

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <FolderOpen className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Projects Yet</h3>
        <p className="text-gray-500">Add your first project to see it appear in the timeline.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="border-l-4 border-blue-100 pl-6">
        {sortedProjects.map((project, idx) => (
          <div key={project._id || project.id} className="mb-10 relative group animate-slide-up" style={{ animationDelay: `${idx * 0.1}s` }}>
            {/* Timeline dot */}
            <span className="absolute -left-7 top-2 w-5 h-5 bg-blue-500 rounded-full border-4 border-white shadow-lg group-hover:bg-blue-600 transition-colors"></span>
            
            {/* Timeline line */}
            {idx < sortedProjects.length - 1 && (
              <div className="absolute -left-4 top-7 w-0.5 h-16 bg-blue-200"></div>
            )}
            
            <div
              className="card cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02] animate-scale-in"
              onClick={() => setSelected(project)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <FolderOpen className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <h3 className="font-semibold text-gray-900 text-lg">{project.title}</h3>
                </div>
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                    title="View project"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
              
              {/* Tags */}
              {project.tags && project.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {project.tags.slice(0, 5).map((tag, index) => (
                    <span 
                      key={index} 
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full flex items-center gap-1"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 5 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{project.tags.length - 5} more
                    </span>
                  )}
                </div>
              )}
              
              {/* Date and Duration */}
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {formatDate(project.startDate)} - {formatDate(project.endDate)}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{getProjectDuration(project.startDate, project.endDate)}</span>
                </div>
              </div>
              
              {/* Description */}
              <p className="text-gray-700 text-sm line-clamp-2 leading-relaxed">
                {project.description}
              </p>
              
              {/* Project Image Preview */}
              {project.image && (
                <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                  <ImageIcon className="w-3 h-3" />
                  <span>Has image</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Modal for project details */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative animate-fade-in">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 z-10"
              onClick={() => setSelected(null)}
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <FolderOpen className="w-8 h-8 text-blue-600 flex-shrink-0" />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selected.title}</h2>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                      <span>{formatDate(selected.startDate)} - {formatDate(selected.endDate)}</span>
                      <span>•</span>
                      <span>{getProjectDuration(selected.startDate, selected.endDate)}</span>
                    </div>
                  </div>
                </div>
                {selected.link && (
                  <a
                    href={selected.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Project
                  </a>
                )}
              </div>

              {/* Project Image */}
              {selected.image && (
                <div className="mb-4">
                  <img
                    src={selected.image}
                    alt={selected.title}
                    className="w-full h-48 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* Tags */}
              {selected.tags && selected.tags.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Technologies Used</h3>
                  <div className="flex flex-wrap gap-2">
                    {selected.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full flex items-center gap-1"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selected.description}
                </p>
              </div>

              {/* Project Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h3 className="font-medium text-gray-700 mb-1">Start Date</h3>
                  <p className="text-gray-600">{formatDate(selected.startDate)}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700 mb-1">End Date</h3>
                  <p className="text-gray-600">{formatDate(selected.endDate)}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700 mb-1">Duration</h3>
                  <p className="text-gray-600">{getProjectDuration(selected.startDate, selected.endDate)}</p>
                </div>
                {selected.link && (
                  <div>
                    <h3 className="font-medium text-gray-700 mb-1">Project Link</h3>
                    <a
                      href={selected.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 break-all"
                    >
                      {selected.link}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectTimeline; 