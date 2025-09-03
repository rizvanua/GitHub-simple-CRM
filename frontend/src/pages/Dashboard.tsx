import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ProjectList from '../components/ProjectList';
import GitHubRepoForm from '../components/GitHubRepoForm';

// Define types locally
interface HealthCheck {
  status: 'healthy' | 'unhealthy';
  mongodb: boolean;
  postgresql: boolean;
  timestamp?: string;
}

const API_ENDPOINTS = {
  CUSTOMERS: '/api/customers',
  ORDERS: '/api/orders',
  PRODUCTS: '/api/products',
  HEALTH: '/health',
} as const;

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [apiStatus, setApiStatus] = useState<HealthCheck | null>(null);
  const [showGitHubForm, setShowGitHubForm] = useState(false);

  useEffect(() => {
    checkApiStatus();
  }, []);

  const checkApiStatus = async (): Promise<void> => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}${API_ENDPOINTS.HEALTH}`);
      const data: HealthCheck = await response.json();
      setApiStatus(data);
    } catch (err) {
      console.error('API connection error:', err);
    }
  };

  const handleLogout = () => {
    logout(() => {
      navigate('/login', { replace: true });
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">🚀 GitHub Project Manager</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.email}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* System Status */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">System Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">MongoDB</span>
                <span className={`font-bold ${apiStatus?.mongodb ? 'text-green-600' : 'text-red-600'}`}>
                  {apiStatus?.mongodb ? '✅ Connected' : '❌ Disconnected'}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">PostgreSQL</span>
                <span className={`font-bold ${apiStatus?.postgresql ? 'text-green-600' : 'text-red-600'}`}>
                  {apiStatus?.postgresql ? '✅ Connected' : '❌ Disconnected'}
                </span>
              </div>
            </div>
          </div>

          {/* GitHub Repository Form */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">GitHub Integration</h2>
              <button
                onClick={() => setShowGitHubForm(!showGitHubForm)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors"
              >
                {showGitHubForm ? 'Hide Form' : 'Add GitHub Repository'}
              </button>
            </div>
            
            {showGitHubForm && (
              <GitHubRepoForm 
                onSuccess={() => {
                  setShowGitHubForm(false);
                  // Refresh the project list
                  window.location.reload();
                }} 
              />
            )}
          </div>

          {/* Projects Section */}
          <ProjectList />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
