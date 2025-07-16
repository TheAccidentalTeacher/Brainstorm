// This file runs once after all tests
module.exports = async () => {
  // Stop MongoDB memory server
  if (global.__MONGO_SERVER__) {
    await global.__MONGO_SERVER__.stop();
  }
  
  // Stop other test containers if they were started
  if (global.__REDIS_CONTAINER__) {
    await global.__REDIS_CONTAINER__.stop();
  }
  
  if (global.__NEO4J_CONTAINER__) {
    await global.__NEO4J_CONTAINER__.stop();
  }
  
  console.log('Global test teardown complete');
};