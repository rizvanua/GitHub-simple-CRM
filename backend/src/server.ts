import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { setUserModel as setAuthUserModel } from './routes/auth';
import { useEndpoints } from './routes';
import { healthCheckHandler } from './routes/health';
import { UserModel } from './models/User';
import { setUserModel as setAuthMiddlewareUserModel } from './middleware/auth';
import { errorHandler } from './middleware/errorHandler';
import { corsMiddleware } from './middleware/cors';
import { notFoundHandler } from './middleware/notFound';
import { 
  connectMongoDB, 
  connectPostgreSQL, 
  getPostgresPool,
  environment,
  databaseConfig
} from './db-connectors';
import { setupGracefulShutdown } from './utils/gracefulShutdown';

const app = express();
const PORT = environment.PORT;

// Middleware
app.use(helmet());
app.use(corsMiddleware);
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// NOTE: Health check route we use just for self testing purposes
app.get('/health', healthCheckHandler);

useEndpoints(app);

// IMPORTANT: 404 handler - must be after all routes
app.use('*', notFoundHandler);

// IMPORTANT:Error handler - must be last
app.use(errorHandler);

const startServer = async (): Promise<void> => {
  try {
    await connectMongoDB(databaseConfig.mongodb);
    await connectPostgreSQL(databaseConfig.postgresql);
    
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

// Setup graceful shutdown handlers
setupGracefulShutdown();
