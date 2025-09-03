import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User';

interface AuthRequest extends Request {
  user?: any;
}

// Initialize UserModel with PostgreSQL pool
// This will be set from the server.ts file
let userModel: UserModel;

export const setUserModel = (model: UserModel) => {
  userModel = model;
};

export const auth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      res.status(401).json({ success: false, error: 'Access denied. No token provided.' });
      return;
    }

    const decoded = jwt.verify(token, process.env['JWT_SECRET'] || 'your-super-secret-jwt-key-change-in-production') as any;
    const user = await userModel.findById(decoded.userId);
    
    if (!user) {
      res.status(401).json({ success: false, error: 'Invalid token.' });
      return;
    }

    // Remove password_hash from user object for security
    const { password_hash, ...userWithoutPassword } = user;
    req.user = userWithoutPassword;
    next();
  } catch (error) {
    res.status(401).json({ success: false, error: 'Invalid token.' });
  }
};
