import { Request, Response } from 'express';

/**
 * 404 Not Found middleware
 * Handles requests to routes that don't exist
 */
export const notFoundHandler = (_req: Request, res: Response): void => {
  res.status(404).json({ 
    success: false,
    error: 'Route not found' 
  });
};
