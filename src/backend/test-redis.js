const { createClient } = require('redis');

const redisUrl = 'redis://default:7AuAg1XHEEN0nWnhcPt1lT4AHXCuhhsu@redis-17481.c275.us-east-1-4.ec2.redns.redis-cloud.com:17481';

console.log('Testing Redis connection...');
console.log('URL:', redisUrl.replace(/:[^:@]*@/, ':***@')); // Hide password in logs

const client = createClient({ url: redisUrl });

client.on('error', (err) => {
  console.error('❌ Redis connection failed:', err.message);
  process.exit(1);
});

client.connect()
  .then(() => {
    console.log('✅ Redis connection successful!');
    client.quit();
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Redis connection failed:', error.message);
    process.exit(1);
  });
