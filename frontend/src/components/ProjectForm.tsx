import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface Project {
  _id: string;
  owner: string;
  name: string;
  url: string;
  stars: number;
  forks: number;
  openIssues: number;
  createdAt: number;
  githubPath?: string;
}

interface ProjectFormData {
  owner: string;
  name: string;
  url: string;
  stars: number;
  forks: number;
  openIssues: number;
  createdAt: number;
}

interface ProjectFormProps {
  project?: Project | null;
  onClose: () => void;
  onSubmit: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ project, onClose, onSubmit }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ProjectFormData>();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

  useEffect(() => {
    if (project) {
      reset({
        owner: project.owner,
        name: project.name,
        url: project.url,
        stars: project.stars,
        forks: project.forks,
        openIssues: project.openIssues,
        createdAt: project.createdAt,
      });
    } else {
      reset({
        owner: '',
        name: '',
        url: '',
        stars: 0,
        forks: 0,
        openIssues: 0,
        createdAt: Math.floor(Date.now() / 1000), // Current timestamp
      });
    }
  }, [project, reset]);

  const handleFormSubmit = async (data: ProjectFormData) => {
    setIsLoading(true);
    try {
      const url = project 
        ? `${API_URL}/api/projects/${project._id}`
        : `${API_URL}/api/projects`;
      
      const method = project ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save project');
      }

      toast.success(project ? 'Project updated successfully!' : 'Project created successfully!');
      onSubmit();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save project');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {project ? 'Edit Project' : 'Add New Project'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Owner
              </label>
              <input
                {...register('owner', { required: 'Owner is required' })}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., facebook"
              />
              {errors.owner && (
                <p className="mt-1 text-sm text-red-600">{errors.owner.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Name
              </label>
              <input
                {...register('name', { required: 'Project name is required' })}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., react"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project URL
              </label>
              <input
                {...register('url', { 
                  required: 'URL is required',
                  pattern: {
                    value: /^https?:\/\/.*/,
                    message: 'Please enter a valid URL'
                  }
                })}
                type="url"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://github.com/owner/repo"
              />
              {errors.url && (
                <p className="mt-1 text-sm text-red-600">{errors.url.message}</p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stars
                </label>
                <input
                  {...register('stars', { 
                    required: 'Stars count is required',
                    min: { value: 0, message: 'Stars must be 0 or greater' }
                  })}
                  type="number"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.stars && (
                  <p className="mt-1 text-sm text-red-600">{errors.stars.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Forks
                </label>
                <input
                  {...register('forks', { 
                    required: 'Forks count is required',
                    min: { value: 0, message: 'Forks must be 0 or greater' }
                  })}
                  type="number"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.forks && (
                  <p className="mt-1 text-sm text-red-600">{errors.forks.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Open Issues
                </label>
                <input
                  {...register('openIssues', { 
                    required: 'Open issues count is required',
                    min: { value: 0, message: 'Open issues must be 0 or greater' }
                  })}
                  type="number"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.openIssues && (
                  <p className="mt-1 text-sm text-red-600">{errors.openIssues.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Creation Date (Unix Timestamp)
              </label>
              <input
                {...register('createdAt', { 
                  required: 'Creation date is required',
                  min: { value: 0, message: 'Timestamp must be positive' }
                })}
                type="number"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 1640995200"
              />
              {errors.createdAt && (
                <p className="mt-1 text-sm text-red-600">{errors.createdAt.message}</p>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : (project ? 'Update Project' : 'Add Project')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProjectForm;
