import { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
  statusCode: number;
  isOperational: boolean;
}

export const errorHandler = (err: AppError, _req: Request, res: Response, _next: NextFunction): void => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({ 
    success: false,
    error: err.message || 'Something went wrong!' 
  });
};

export type { AppError };
