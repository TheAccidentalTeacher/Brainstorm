const mongoose = require('mongoose');

const mongoURI = 'mongodb+srv://scosom:nonPhubic4@brainstorm-cluster.bg60my0.mongodb.net/brainstorm?retryWrites=true&w=majority&appName=Brainstorm-Cluster';

console.log('Testing MongoDB connection...');
console.log('URI:', mongoURI.replace(/:[^:@]*@/, ':***@')); // Hide password in logs

mongoose.connect(mongoURI)
  .then(() => {
    console.log('✅ MongoDB connection successful!');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ MongoDB connection failed:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    if (error.message.includes('authentication failed')) {
      console.error('🔑 Authentication failed - password is incorrect');
    }
    process.exit(1);
  });
