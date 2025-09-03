import express, { Request, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { setUserModel as setAuthUserModel } from './routes/auth';
import { useEndpoints } from './routes';
import { UserModel } from './models/User';
import { setUserModel as setAuthMiddlewareUserModel } from './middleware/auth';
import { errorHandler } from './middleware/errorHandler';
import { corsMiddleware } from './middleware/cors';
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

const app = express();
const PORT = environment.PORT;

// Middleware
app.use(helmet());
app.use(corsMiddleware);
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Health check route
app.get('/health', (_req: Request, res: Response) => {
  const healthCheck: HealthCheck = {
    status: (getMongoDBStatus() && getPostgreSQLStatus()) ? 'healthy' : 'unhealthy',
    mongodb: getMongoDBStatus(),
    postgresql: getPostgreSQLStatus(),
    timestamp: new Date().toISOString()
  };
  res.json(healthCheck);
});

// API Routes - Clean and focused on our current architecture
useEndpoints(app);

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
