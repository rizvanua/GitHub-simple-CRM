import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { Pool } from 'pg';
import authRoutes, { setUserModel as setAuthUserModel } from './routes/auth';
import projectRoutes from './routes/projects';
import githubRoutes from './routes/github';
import { UserModel } from './models/User';
import { setUserModel as setAuthMiddlewareUserModel } from './middleware/auth';
// Define types locally for now to avoid import issues
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface HealthCheck {
  status: 'healthy' | 'unhealthy';
  mongodb: boolean;
  postgresql: boolean;
  timestamp?: string;
}

interface AppError extends Error {
  statusCode: number;
  isOperational: boolean;
}

interface Environment {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  MONGODB_URI: string;
  POSTGRES_URI: string;
  JWT_SECRET: string;
}

interface DatabaseConfig {
  mongodb: {
    uri: string;
    options?: {
      useNewUrlParser?: boolean;
      useUnifiedTopology?: boolean;
    };
  };
  postgresql: {
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
  };
}

const API_ENDPOINTS = {
  CUSTOMERS: '/api/customers',
  ORDERS: '/api/orders',
  PRODUCTS: '/api/products',
  HEALTH: '/health',
  AUTH: '/api/auth',
  PROJECTS: '/api/projects',
  GITHUB: '/api/github',
} as const;

const app = express();
const PORT = process.env['PORT'] || 5000;

// Environment configuration
const environment: Environment = {
  NODE_ENV: (process.env['NODE_ENV'] as 'development' | 'production' | 'test') || 'development',
  PORT: parseInt(process.env['PORT'] || '5000', 10),
  MONGODB_URI: process.env['MONGODB_URI'] || 'mongodb://admin:password123@mongodb:27017/crm?authSource=admin',
  POSTGRES_URI: process.env['POSTGRES_URI'] || 'postgresql://admin:password123@postgresql:5432/crm',
  JWT_SECRET: process.env['JWT_SECRET'] || 'your-super-secret-jwt-key-change-in-production'
};

// Database configuration
const databaseConfig: DatabaseConfig = {
  mongodb: {
    uri: environment.MONGODB_URI,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  },
  postgresql: {
    host: 'postgresql',
    port: 5432,
    database: 'crm',
    username: 'admin',
    password: 'password123'
  }
};

// Middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const connectMongoDB = async (): Promise<void> => {
  try {
    await mongoose.connect(databaseConfig.mongodb.uri);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// PostgreSQL Connection
const postgresPool = new Pool({
  connectionString: environment.POSTGRES_URI,
});

// Initialize UserModel
const userModel = new UserModel(postgresPool);

const connectPostgreSQL = async (): Promise<void> => {
  try {
    await postgresPool.connect();
    console.log('✅ PostgreSQL connected successfully');
  } catch (error) {
    console.error('❌ PostgreSQL connection error:', error);
    process.exit(1);
  }
};

// Error handling middleware
const errorHandler = (err: AppError, _req: Request, res: Response, _next: NextFunction): void => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({ 
    success: false,
    error: err.message || 'Something went wrong!' 
  });
};

// Basic Routes
app.get('/', (_req: Request, res: Response) => {
  const response: ApiResponse<{
    message: string;
    status: string;
    timestamp: string;
    databases: {
      mongodb: string;
      postgresql: string;
    };
  }> = {
    success: true,
    data: {
      message: 'Welcome to Simple CRM API',
      status: 'running',
      timestamp: new Date().toISOString(),
      databases: {
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        postgresql: postgresPool.totalCount > 0 ? 'connected' : 'disconnected'
      }
    }
  };
  res.json(response);
});

app.get(API_ENDPOINTS.HEALTH, (_req: Request, res: Response) => {
  const healthCheck: HealthCheck = {
    status: (mongoose.connection.readyState === 1 && postgresPool.totalCount > 0) ? 'healthy' : 'unhealthy',
    mongodb: mongoose.connection.readyState === 1,
    postgresql: postgresPool.totalCount > 0,
    timestamp: new Date().toISOString()
  };
  res.json(healthCheck);
});

// API Routes
app.get(API_ENDPOINTS.CUSTOMERS, async (_req: Request, res: Response) => {
  try {
    // Example: Get customers from MongoDB
    const response: ApiResponse<{ message: string }> = {
      success: true,
      data: { message: 'Customers endpoint - MongoDB integration ready' }
    };
    res.json(response);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
});

app.get(API_ENDPOINTS.ORDERS, async (_req: Request, res: Response) => {
  try {
    // Example: Get orders from PostgreSQL
    const response: ApiResponse<{ message: string }> = {
      success: true,
      data: { message: 'Orders endpoint - PostgreSQL integration ready' }
    };
    res.json(response);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
});

// Initialize UserModel in auth routes and middleware
setAuthUserModel(userModel);
setAuthMiddlewareUserModel(userModel);

// Auth routes
app.use(API_ENDPOINTS.AUTH, authRoutes);

// Project routes
app.use(API_ENDPOINTS.PROJECTS, projectRoutes);

// GitHub routes
app.use(API_ENDPOINTS.GITHUB, githubRoutes);

// 404 handler
app.use('*', (_req: Request, res: Response) => {
  res.status(404).json({ 
    success: false,
    error: 'Route not found' 
  });
});

// Apply error handling middleware
app.use(errorHandler);

// Start server
const startServer = async (): Promise<void> => {
  try {
    await connectMongoDB();
    await connectPostgreSQL();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${environment.NODE_ENV}`);
      console.log(`🔗 API URL: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await mongoose.connection.close();
  await postgresPool.end();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await mongoose.connection.close();
  await postgresPool.end();
  process.exit(0);
});
