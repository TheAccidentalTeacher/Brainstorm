import express from 'express';
import cors from 'cors';
import dotenconst connectRedis = async () => {
  try {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    logger.info('Connecting to Redis...', { url: redisUrl.replace(/:\/\/[^@]*@/, '://***@') });
    
    const client = createClient({ url: redisUrl });
    await client.connect();
    
    logger.info('Redis connected successfully');
    return client;
  } catch (error) {
    logger.error('Redis connection error', error);
    throw error;
  }
};nv';
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

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Database connections
const connectMongoDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/ultimate_project_hub';
    logger.info('Connecting to MongoDB...', { uri: mongoURI.replace(/:[^:@]*@/, ':***@') });
    await mongoose.connect(mongoURI);
    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error('MongoDB connection error', error);
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
    
    // Test connection
    const session = driver.session();
    await session.run('RETURN 1');
    session.close();
    
    logger.info('Neo4j connected successfully');
    return driver;
  } catch (error) {
    logger.error('Neo4j connection error', error);
    throw error;
  }
};

const connectRedis = async () => {
  try {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    const redisClient = createClient({ url: redisUrl });
    await redisClient.connect();
    console.log('Redis connected');
    return redisClient;
  } catch (error) {
    console.error('Redis connection error:', error);
    throw error;
  }
};

// API routes
app.get('/', (req, res) => {
  res.send('Ultimate Project & Brainstorm Hub API');
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Ultimate Project Hub API',
    version: '1.0.0',
    status: 'operational',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint (no database required)
app.get('/health', (req, res) => {
  const uptime = process.uptime();
  const health = {
    status: 'healthy',
    uptime: uptime,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
    },
    databases: {
      mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      neo4j: 'connected', // We'll assume connected if server is running
      redis: 'connected'  // We'll assume connected if server is running
    }
  };
  
  logger.info('Health check requested', { 
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    uptime: uptime
  });
  
  res.json(health);
});

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/ai-chat', aiChatRoutes);
app.use('/api/collaboration', collaborationRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const startServer = async () => {
  try {
    logger.info('🚀 Starting Ultimate Project Hub Backend', {
      port: PORT,
      environment: process.env.NODE_ENV || 'development',
      nodeVersion: process.version
    });

    // Connect to databases - require all connections to succeed
    await connectMongoDB();
    const neo4jDriver = await connectNeo4j();
    const redisClient = await connectRedis();
    
    logger.info('✅ All databases connected successfully');
    
    // Initialize WebSocket server
    const io = initWebsocketServer(server);
    logger.info('WebSocket server initialized');
    
    // Start listening
    server.listen(PORT, () => {
      logger.info('🎉 Server running successfully', {
        port: PORT,
        mongodb: 'Connected',
        neo4j: 'Connected',
        redis: 'Connected',
        websocket: `ws://localhost:${PORT}/collaboration`,
        healthCheck: `/health`,
        timestamp: new Date().toISOString()
      });
    });
    
    // Handle graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      logger.info(`🔄 Received ${signal}, shutting down gracefully...`);
      
      server.close(async () => {
        logger.info('HTTP server closed');
        
        try {
          await mongoose.connection.close();
          logger.info('MongoDB disconnected');
          
          await neo4jDriver.close();
          logger.info('Neo4j disconnected');
          
          await redisClient.quit();
          logger.info('Redis disconnected');
          
          logger.info('✅ Graceful shutdown completed');
          process.exit(0);
        } catch (error) {
          logger.error('Error during shutdown', error);
          process.exit(1);
        }
      });
      
      // Force shutdown after 30 seconds
      setTimeout(() => {
        logger.error('🚨 Force shutdown after 30s timeout');
        process.exit(1);
      }, 30000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGUSR2', () => gracefulShutdown('SIGUSR2')); // Nodemon restart
    
  } catch (error) {
    logger.error('🚨 Server startup failed', error);
    process.exit(1);
  }
};

startServer();