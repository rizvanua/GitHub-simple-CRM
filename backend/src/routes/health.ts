import { Request, Response } from 'express';
import { getMongoDBStatus, getPostgreSQLStatus } from '../db-connectors';

interface HealthCheck {
  status: 'healthy' | 'unhealthy';
  mongodb: boolean;
  postgresql: boolean;
  timestamp?: string;
}

/**
 * Health check route handler
 * Returns the status of database connections
 */
export const healthCheckHandler = (_req: Request, res: Response): void => {
  const healthCheck: HealthCheck = {
    status: (getMongoDBStatus() && getPostgreSQLStatus()) ? 'healthy' : 'unhealthy',
    mongodb: getMongoDBStatus(),
    postgresql: getPostgreSQLStatus(),
    timestamp: new Date().toISOString()
  };
  res.json(healthCheck);
};
