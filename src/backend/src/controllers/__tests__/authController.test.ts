import { Request, Response } from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as authController from '../authController';
import User from '../../models/User';

// Mock User model
jest.mock('../../models/User');

// Mock bcrypt
jest.mock('bcrypt');

// Mock jsonwebtoken
jest.mock('jsonwebtoken');

describe('Auth Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  
  beforeEach(() => {
    req = {
      body: {},
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  describe('register', () => {
    it('should register a new user successfully', async () => {
      // Arrange
      req.body = {
        email: 'test@example.com',
        password: 'password123',
        displayName: 'Test User',
      };
      
      const mockUser = {
        _id: new mongoose.Types.ObjectId(),
        email: 'test@example.com',
        displayName: 'Test User',
        save: jest.fn().mockResolvedValue(true),
      };
      
      (User.findOne as jest.Mock).mockResolvedValue(null);
      (User.create as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      (jwt.sign as jest.Mock).mockReturnValue('mockToken');
      
      // Act
      await authController.register(req as Request, res as Response);
      
      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', expect.any(Number));
      expect(User.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'hashedPassword',
        displayName: 'Test User',
      });
      expect(jwt.sign).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User registered successfully',
        token: 'mockToken',
        user: expect.objectContaining({
          email: 'test@example.com',
          displayName: 'Test User',
        }),
      });
    });
    
    it('should return 400 if user already exists', async () => {
      // Arrange
      req.body = {
        email: 'existing@example.com',
        password: 'password123',
        displayName: 'Existing User',
      };
      
      (User.findOne as jest.Mock).mockResolvedValue({
        email: 'existing@example.com',
      });
      
      // Act
      await authController.register(req as Request, res as Response);
      
      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ email: 'existing@example.com' });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User already exists',
      });
    });
    
    it('should return 400 if required fields are missing', async () => {
      // Arrange
      req.body = {
        email: 'test@example.com',
        // Missing password and displayName
      };
      
      // Act
      await authController.register(req as Request, res as Response);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Email, password, and display name are required',
      });
    });
    
    it('should return 500 if an error occurs', async () => {
      // Arrange
      req.body = {
        email: 'test@example.com',
        password: 'password123',
        displayName: 'Test User',
      };
      
      const error = new Error('Database error');
      (User.findOne as jest.Mock).mockRejectedValue(error);
      
      // Act
      await authController.register(req as Request, res as Response);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error registering user',
        error: 'Database error',
      });
    });
  });
  
  describe('login', () => {
    it('should login a user successfully', async () => {
      // Arrange
      req.body = {
        email: 'test@example.com',
        password: 'password123',
      };
      
      const mockUser = {
        _id: new mongoose.Types.ObjectId(),
        email: 'test@example.com',
        displayName: 'Test User',
        password: 'hashedPassword',
      };
      
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('mockToken');
      
      // Act
      await authController.login(req as Request, res as Response);
      
      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
      expect(jwt.sign).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Login successful',
        token: 'mockToken',
        user: expect.objectContaining({
          email: 'test@example.com',
          displayName: 'Test User',
        }),
      });
    });
    
    it('should return 400 if user does not exist', async () => {
      // Arrange
      req.body = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };
      
      (User.findOne as jest.Mock).mockResolvedValue(null);
      
      // Act
      await authController.login(req as Request, res as Response);
      
      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ email: 'nonexistent@example.com' });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid credentials',
      });
    });
    
    it('should return 400 if password is incorrect', async () => {
      // Arrange
      req.body = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };
      
      const mockUser = {
        _id: new mongoose.Types.ObjectId(),
        email: 'test@example.com',
        displayName: 'Test User',
        password: 'hashedPassword',
      };
      
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      
      // Act
      await authController.login(req as Request, res as Response);
      
      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', 'hashedPassword');
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid credentials',
      });
    });
    
    it('should return 400 if required fields are missing', async () => {
      // Arrange
      req.body = {
        email: 'test@example.com',
        // Missing password
      };
      
      // Act
      await authController.login(req as Request, res as Response);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Email and password are required',
      });
    });
    
    it('should return 500 if an error occurs', async () => {
      // Arrange
      req.body = {
        email: 'test@example.com',
        password: 'password123',
      };
      
      const error = new Error('Database error');
      (User.findOne as jest.Mock).mockRejectedValue(error);
      
      // Act
      await authController.login(req as Request, res as Response);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error logging in',
        error: 'Database error',
      });
    });
  });
});