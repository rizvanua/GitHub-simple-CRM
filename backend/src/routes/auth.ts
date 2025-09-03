import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { UserModel } from '../models/User';

const router = express.Router();

// Initialize UserModel with PostgreSQL pool
// This will be set from the server.ts file
let userModel: UserModel;

export const setUserModel = (model: UserModel) => {
  userModel = model;
};

// Register user
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await userModel.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        error: 'User with this email already exists' 
      });
    }

    // Create new user
    const user = await userModel.create({ email, password });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env['JWT_SECRET'] || 'your-super-secret-jwt-key-change-in-production',
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email
        },
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// Login user
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').exists()
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { email, password } = req.body;

    // Find user
    const user = await userModel.findByEmail(email);
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid credentials' 
      });
    }

    // Check password
    const isMatch = await userModel.comparePassword(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid credentials' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env['JWT_SECRET'] || 'your-super-secret-jwt-key-change-in-production',
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

export default router;
