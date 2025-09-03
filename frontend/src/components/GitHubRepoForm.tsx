import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

interface GitHubRepoFormData {
  repoPath: string;
}

interface GitHubRepoFormProps {
  onSuccess: () => void;
}

const GitHubRepoForm: React.FC<GitHubRepoFormProps> = ({ onSuccess }) => {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<GitHubRepoFormData>();

  const repoPath = watch('repoPath');

  const checkRepository = async (repoPath: string) => {
    if (!repoPath || !token) return;

    setIsChecking(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/github/check/${encodeURIComponent(repoPath)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        if (data.exists) {
          toast.error('Repository already exists in your projects');
        } else if (data.existsOnGitHub) {
          toast.success('Repository found on GitHub and can be added');
        } else {
          toast.error('Repository not found on GitHub');
        }
      } else {
        toast.error(data.message || 'Failed to check repository');
      }
    } catch (error) {
      toast.error('Failed to check repository');
    } finally {
      setIsChecking(false);
    }
  };

  const onSubmit = async (data: GitHubRepoFormData) => {
    if (!token) {
      toast.error('Authentication required');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/github`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.success) {
        toast.success('GitHub repository added successfully!');
        reset();
        onSuccess();
      } else {
        toast.error(result.message || 'Failed to add repository');
      }
    } catch (error) {
      toast.error('Failed to add repository');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Add GitHub Repository
      </h3>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="repoPath" className="block text-sm font-medium text-gray-700 mb-1">
            Repository Path
          </label>
          <div className="flex space-x-2">
            <input
              id="repoPath"
              type="text"
              placeholder="e.g., facebook/react"
              className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.repoPath ? 'border-red-500' : 'border-gray-300'
              }`}
              {...register('repoPath', {
                required: 'Repository path is required',
                pattern: {
                  value: /^[a-zA-Z0-9._-]+\/[a-zA-Z0-9._-]+$/,
                  message: 'Invalid format. Use: owner/repository'
                }
              })}
            />
            <button
              type="button"
              onClick={() => checkRepository(repoPath)}
              disabled={!repoPath || isChecking}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isChecking ? 'Checking...' : 'Check'}
            </button>
          </div>
          {errors.repoPath && (
            <p className="mt-1 text-sm text-red-600">{errors.repoPath.message}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Enter the repository path in the format: owner/repository
          </p>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => reset()}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Clear
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Adding...' : 'Add Repository'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GitHubRepoForm;
