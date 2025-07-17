import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import neo4j from 'neo4j-driver';
import { createClient } from 'redis';
import http from 'http';
import { initWebsocketServer } from './services/websocketService';
import logger, { requestLogger } from './utils/logger';

// Import routes
import authRoutes from './routes/authRoutes';
import projectRoutes from './routes/projectRoutes';
import contentRoutes from './routes/contentRoutes';
import aiChatRoutes from './routes/aiChatRoutes';
import collaborationRoutes from './routes/collaborationRoutes';

// Load environment variables
dotenv.config();

// Log startup information
logger.info('Starting Ultimate Project & Brainstorm Hub API', {
  nodeVersion: process.version,
  environment: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  timestamp: new Date().toISOString()
});

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger); // Add request logging middleware

// Database connections
const connectMongoDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/ultimate_project_hub';
    logger.info('Connecting to MongoDB...', { uri: mongoURI.replace(/:[^:@]*@/, ':***@') });
    
    await mongoose.connect(mongoURI);
    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error('MongoDB connection failed', error);
    throw error;
  }
};

const connectNeo4j = async () => {
  try {
    const neo4jUri = process.env.NEO4J_URI || 'bolt://localhost:7687';
    const neo4jUser = process.env.NEO4J_USER || 'neo4j';
    const neo4jPassword = process.env.NEO4J_PASSWORD || 'password';
    
    logger.info('Connecting to Neo4j...', { uri: neo4jUri, user: neo4jUser });
    
    const driver = neo4j.driver(neo4jUri, neo4j.auth.basic(neo4jUser, neo4jPassword));
    
    // Actually test the connection
    await driver.verifyConnectivity();
    logger.info('Neo4j connected successfully');
    return driver;
  } catch (error) {
    logger.error('Neo4j connection failed', error);
    throw error;
  }
};

const connectRedis = async () => {
  try {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    logger.info('Connecting to Redis...', { url: redisUrl.replace(/:[^:@]*@/, ':***@') });
    
    const redisClient = createClient({ url: redisUrl });
    await redisClient.connect();
    logger.info('Redis connected successfully');
    return redisClient;
  } catch (error) {
    logger.error('Redis connection failed', error);
    throw error;
  }
};

// API routes
app.get('/', (req, res) => {
  logger.info('Root endpoint accessed');
  res.json({
    message: 'Ultimate Project & Brainstorm Hub API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    status: 'operational',
    endpoints: [
      'GET /',
      'GET /health',
      'POST /api/auth/login',
      'POST /api/auth/register',
      'GET /api/auth/me',
      'GET /api/projects',
      'POST /api/projects',
      'GET /api/content',
      'POST /api/ai-chat/chats',
      'GET /api/collaboration/sessions'
    ]
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  logger.info('Health check accessed');
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Health check endpoint (no database required)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/ai-chat', aiChatRoutes);
app.use('/api/collaboration', collaborationRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error occurred', err, {
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body
  });
  res.status(500).json({ 
    message: 'Something went wrong!',
    timestamp: new Date().toISOString(),
    requestId: (req as any).requestId
  });
});

// Start server
const startServer = async () => {
  try {
    logger.info('Starting server initialization...');
    
    // Connect to databases - require all connections to succeed
    await connectMongoDB();
    const neo4jDriver = await connectNeo4j();
    const redisClient = await connectRedis();
    
    logger.info('All databases connected successfully');
    
    // Initialize WebSocket server
    const io = initWebsocketServer(server);
    logger.info('WebSocket server initialized');
    
    // Start listening
    server.listen(PORT, () => {
      logger.info(`🚀 Server is running!`, {
        port: PORT,
        environment: process.env.NODE_ENV || 'development',
        pid: process.pid,
        nodeVersion: process.version,
        mongoStatus: 'Connected',
        neo4jStatus: 'Connected',
        redisStatus: 'Connected',
        websocketStatus: 'Active'
      });
      
      console.log(`
🎉 Ultimate Project & Brainstorm Hub API is running!
📍 Port: ${PORT}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
🔗 Health Check: http://localhost:${PORT}/health
📊 WebSocket: ws://localhost:${PORT}/collaboration
🐛 Debug Mode: ${process.env.DEBUG_MODE === 'true' ? 'Enabled' : 'Disabled'}
      `);
    });
    
    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      logger.info('Received SIGINT, shutting down gracefully...');
      await mongoose.connection.close();
      await neo4jDriver.close();
      await redisClient.quit();
      server.close(() => {
        logger.info('Server shut down complete');
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error('Server startup failed', error);
    console.error('❌ Failed to start server. Please check your database connections.');
    process.exit(1);
  }
};

startServer();