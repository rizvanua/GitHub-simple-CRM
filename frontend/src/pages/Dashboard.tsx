import React, { useState } from 'react';
import ProjectList from '../components/ProjectList';
import GitHubRepoForm from '../components/GitHubRepoForm';
import NavigationHeader from '../components/NavigationHeader';
import SystemHealthStatus from '../components/SystemHealthStatus';

const Dashboard: React.FC = () => {
  const [showGitHubForm, setShowGitHubForm] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader />     
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <SystemHealthStatus />
          
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
          <ProjectList />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
