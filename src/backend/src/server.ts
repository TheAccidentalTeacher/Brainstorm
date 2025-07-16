import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { driver as neo4jDriver } from 'neo4j-driver';
import { createClient } from 'redis';
import http from 'http';
import { initWebsocketServer } from './services/websocketService';

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

// Database connections
const connectMongoDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/ultimate_project_hub';
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const connectNeo4j = () => {
  try {
    const neo4jUri = process.env.NEO4J_URI || 'bolt://localhost:7687';
    const neo4jUser = process.env.NEO4J_USER || 'neo4j';
    const neo4jPassword = process.env.NEO4J_PASSWORD || 'password';
    
    const driver = neo4jDriver(neo4jUri, { username: neo4jUser, password: neo4jPassword });
    console.log('Neo4j connected');
    return driver;
  } catch (error) {
    console.error('Neo4j connection error:', error);
    process.exit(1);
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
    process.exit(1);
  }
};

// API routes
app.get('/', (req, res) => {
  res.send('Ultimate Project & Brainstorm Hub API');
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
    // Connect to databases
    await connectMongoDB();
    const neo4jDriver = connectNeo4j();
    const redisClient = await connectRedis();
    
    // Initialize WebSocket server
    const { wsServer, io } = initWebsocketServer(server);
    
    // Start listening
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`WebSocket server running on ws://localhost:${PORT}/collaboration`);
    });
    
    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      console.log('Shutting down server...');
      await mongoose.connection.close();
      await neo4jDriver.close();
      await redisClient.quit();
      server.close();
      process.exit(0);
    });
  } catch (error) {
    console.error('Server startup error:', error);
    process.exit(1);
  }
};

startServer();