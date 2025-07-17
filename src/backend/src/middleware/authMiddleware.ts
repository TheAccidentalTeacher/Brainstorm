import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User';

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';

// Interface for decoded token
interface DecodedToken {
  id: string;
  email: string;
  iat: number;
  exp: number;
}

// Middleware to authenticate JWT token
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'No token provided' });
      return;
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;

    // Find user
    const user = await User.findById(decoded.id).select('-passwordHash');
    
    if (!user) {
      res.status(401).json({ message: 'Invalid token' });
      return;
    }

    // Check if user is active
    if (user.status !== 'active') {
      res.status(403).json({ message: 'Account is not active' });
      return;
    }

    // Attach user to request
    (req as any).user = {
      id: user._id,
      email: user.email,
      displayName: user.displayName,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: 'Invalid token' });
      return;
    }
    
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: 'Token expired' });
      return;
    }
    
    console.error('Authentication error:', error);
    res.status(500).json({ message: 'Server error during authentication' });
  }
};

// Middleware to check if user is admin
export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    
    if (!userId) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const user = await User.findById(userId);
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Check if user is admin (you might want to add an isAdmin field to your User model)
    // For now, we'll just check if the user has a specific email domain
    if (!user.email.endsWith('@admin.com')) {
      res.status(403).json({ message: 'Admin access required' });
      return;
    }

    next();
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({ message: 'Server error during admin check' });
  }
};

// Middleware to check team membership
export const isTeamMember = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const teamId = new mongoose.Types.ObjectId(req.params.teamId);
    
    if (!userId) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const user = await User.findById(userId);
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Check if user is a member of the team
    if (!user.teams.includes(teamId)) {
      res.status(403).json({ message: 'Not a member of this team' });
      return;
    }

    next();
  } catch (error) {
    console.error('Team membership check error:', error);
    res.status(500).json({ message: 'Server error during team membership check' });
  }
};