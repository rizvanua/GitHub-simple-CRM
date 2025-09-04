import React, { useState, useEffect } from 'react';

interface HealthCheck {
  status: 'healthy' | 'unhealthy';
  mongodb: boolean;
  postgresql: boolean;
  timestamp?: string;
}

const API_ENDPOINTS = {
  HEALTH: '/health',
} as const;

const SystemHealthStatus: React.FC = () => {
  const [apiStatus, setApiStatus] = useState<HealthCheck | null>(null);

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

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">System Health Status</h2>
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
  );
};

export default SystemHealthStatus;
