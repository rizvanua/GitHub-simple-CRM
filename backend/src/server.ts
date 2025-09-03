import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes, { setUserModel as setAuthUserModel } from './routes/auth';
import projectRoutes from './routes/projects';
import githubRoutes from './routes/github';
import { UserModel } from './models/User';
import { setUserModel as setAuthMiddlewareUserModel } from './middleware/auth';
import { 
  connectMongoDB, 
  disconnectMongoDB, 
  getMongoDBStatus,
  connectPostgreSQL, 
  disconnectPostgreSQL, 
  getPostgreSQLStatus,
  getPostgresPool,
  environment,
  databaseConfig
} from './db-connectors';

// Define types locally for now to avoid import issues
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

const API_ENDPOINTS = {
  HEALTH: '/health',
  AUTH: '/api/auth',
  PROJECTS: '/api/projects',
  GITHUB: '/api/github',
} as const;

const app = express();
const PORT = environment.PORT;

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

// Error handling middleware
const errorHandler = (err: AppError, _req: Request, res: Response, _next: NextFunction): void => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({ 
    success: false,
    error: err.message || 'Something went wrong!' 
  });
};

// Health check route
app.get(API_ENDPOINTS.HEALTH, (_req: Request, res: Response) => {
  const healthCheck: HealthCheck = {
    status: (getMongoDBStatus() && getPostgreSQLStatus()) ? 'healthy' : 'unhealthy',
    mongodb: getMongoDBStatus(),
    postgresql: getPostgreSQLStatus(),
    timestamp: new Date().toISOString()
  };
  res.json(healthCheck);
});

// API Routes - Clean and focused on our current architecture

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
    await connectMongoDB(databaseConfig.mongodb);
    await connectPostgreSQL(databaseConfig.postgresql);
    
    // Initialize UserModel after database connections
    const postgresPool = getPostgresPool();
    const userModel = new UserModel(postgresPool);
    setAuthUserModel(userModel);
    setAuthMiddlewareUserModel(userModel);
    
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
  await disconnectMongoDB();
  await disconnectPostgreSQL();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await disconnectMongoDB();
  await disconnectPostgreSQL();
  process.exit(0);
});
