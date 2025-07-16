// This file runs once before all tests
const { MongoMemoryServer } = require('mongodb-memory-server');
const { GenericContainer } = require('testcontainers');

module.exports = async () => {
  // Store global variables that will be available in all test files
  global.__MONGO_SERVER__ = await MongoMemoryServer.create();
  global.__MONGO_URI__ = global.__MONGO_SERVER__.getUri();
  
  // Set environment variables for tests
  process.env.MONGO_URI = global.__MONGO_URI__;
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-jwt-secret';
  process.env.REDIS_URL = 'redis://localhost:6379';
  process.env.NEO4J_URI = 'bolt://localhost:7687';
  process.env.NEO4J_USER = 'neo4j';
  process.env.NEO4J_PASSWORD = 'password';
  
  // You can start other test containers here if needed
  // For example, Redis or Neo4j containers for integration tests
  // This is commented out because we're mocking these services in jest.setup.js
  
  /*
  try {
    // Start Redis container
    const redisContainer = await new GenericContainer('redis:7')
      .withExposedPorts(6379)
      .start();
      
    global.__REDIS_CONTAINER__ = redisContainer;
    process.env.REDIS_URL = `redis://${redisContainer.getHost()}:${redisContainer.getMappedPort(6379)}`;
    
    // Start Neo4j container
    const neo4jContainer = await new GenericContainer('neo4j:5')
      .withExposedPorts(7474, 7687)
      .withEnvironment({
        NEO4J_AUTH: 'neo4j/password',
      })
      .start();
      
    global.__NEO4J_CONTAINER__ = neo4jContainer;
    process.env.NEO4J_URI = `bolt://${neo4jContainer.getHost()}:${neo4jContainer.getMappedPort(7687)}`;
  } catch (error) {
    console.error('Error starting test containers:', error);
  }
  */
  
  console.log('Global test setup complete');
};