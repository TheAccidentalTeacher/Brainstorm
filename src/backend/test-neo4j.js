const neo4j = require('neo4j-driver');

const neo4jUri = 'neo4j+s://0de041b2.databases.neo4j.io';
const neo4jUser = 'neo4j';
const neo4jPassword = '6L7nsnwKqDGJ3xZc5MzfMdDGrOapI-7c0rkSKsQ0EvU';

console.log('Testing Neo4j connection...');
console.log('URI:', neo4jUri);
console.log('User:', neo4jUser);

const driver = neo4j.driver(neo4jUri, neo4j.auth.basic(neo4jUser, neo4jPassword));

driver.verifyConnectivity()
  .then(() => {
    console.log('✅ Neo4j connection successful!');
    driver.close();
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Neo4j connection failed:', error.message);
    driver.close();
    process.exit(1);
  });
