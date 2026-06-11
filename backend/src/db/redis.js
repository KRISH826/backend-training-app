import IORedis from "ioredis";

const connection = new IORedis({
  host: '127.0.0.1',
  port: 6379,
  maxRetriesPerRequest: null,
  lazyConnect: false // default hi false hai, explicitly likhne ki zaroorat nahi
});

// Event listeners lagao status check ke liye
connection.on('connect', () => console.log('✅ Redis connected!'));
connection.on('error', (err) => console.error('❌ Redis error:', err.message));

export default connection;