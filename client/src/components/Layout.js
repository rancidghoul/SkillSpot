import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Code, 
  FolderOpen, 
  Briefcase, 
  FileText,
  BarChart3,
  Settings,
  LogOut,
  User
} from 'lucide-react';

const Layout = ({ children }) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Home', href: '/', icon: BarChart3 },
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Skills', href: '/skills', icon: Code },
    { name: 'Projects', href: '/projects', icon: FolderOpen },
    { name: 'Job Matches', href: '/job-matches', icon: Briefcase },
    { name: 'Resume Export', href: '/resume-export', icon: FileText },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r border-gray-200">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">SkillPlot</h1>
          </div>
        </div>
        
        <nav className="px-4 pb-4">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`sidebar-item ${isActive ? 'active' : ''}`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom section */}
        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200 space-y-2">
          {/* User info */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email || 'user@example.com'}
              </p>
            </div>
          </div>
          
          {/* Settings and Logout */}
          <div className="space-y-1">
            <Link
              to="/settings"
              className="sidebar-item"
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </Link>
            <button
              onClick={logout}
              className="sidebar-item w-full text-left text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout; 