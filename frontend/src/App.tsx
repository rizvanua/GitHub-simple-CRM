import { useState, useEffect } from 'react';
import './App.css';

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

function App(): JSX.Element {
  const [apiStatus, setApiStatus] = useState<HealthCheck | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkApiStatus();
  }, []);

  const checkApiStatus = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}${API_ENDPOINTS.HEALTH}`);
      const data: HealthCheck = await response.json();
      setApiStatus(data);
      setError(null);
    } catch (err) {
      setError('Failed to connect to API');
      console.error('API connection error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="text-4xl font-bold text-blue-600 mb-8">
          🚀 Simple CRM System
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          {/* Database Status */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              📊 Database Status
            </h2>
            
            {loading ? (
              <div className="text-gray-600">Loading...</div>
            ) : error ? (
              <div className="text-red-600">{error}</div>
            ) : apiStatus ? (
              <div className="space-y-3">
                <div className={`flex items-center justify-between p-3 rounded ${
                  apiStatus.mongodb ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  <span className="font-medium">MongoDB</span>
                  <span className="font-bold">
                    {apiStatus.mongodb ? '✅ Connected' : '❌ Disconnected'}
                  </span>
                </div>
                
                <div className={`flex items-center justify-between p-3 rounded ${
                  apiStatus.postgresql ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  <span className="font-medium">PostgreSQL</span>
                  <span className="font-bold">
                    {apiStatus.postgresql ? '✅ Connected' : '❌ Disconnected'}
                  </span>
                </div>
              </div>
            ) : null}
            
            <button
              onClick={checkApiStatus}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              🔄 Refresh Status
            </button>
          </div>

          {/* System Info */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              ℹ️ System Information
            </h2>
            
            <div className="space-y-3 text-left">
              <div className="flex justify-between">
                <span className="text-gray-600">Frontend:</span>
                <span className="font-medium">React.js (Port 3000)</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Backend:</span>
                <span className="font-medium">Express.js (Port 5001)</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">MongoDB:</span>
                <span className="font-medium">Port 27017</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">PostgreSQL:</span>
                <span className="font-medium">Port 5432</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            ⚡ Quick Actions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded transition-colors">
              👥 Manage Customers
            </button>
            
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded transition-colors">
              📋 View Orders
            </button>
            
            <button className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-3 px-4 rounded transition-colors">
              📊 Analytics
            </button>
          </div>
        </div>

        <footer className="mt-8 text-gray-600">
          <p>Simple CRM - Built with Docker Compose</p>
          <p className="text-sm mt-2">
            MongoDB • PostgreSQL • Express.js • React.js
          </p>
        </footer>
      </header>
    </div>
  );
}

export default App;
