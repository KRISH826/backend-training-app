import IORedis from "ioredis";  // Default import, named nahi

const connection = new IORedis({
  host: '127.0.0.1',
  port: 6379,
  maxRetriesPerRequest: null // BullMQ ke liye yeh zaroori hai
});

export const dbConnection = async () => {
  try {
    await connection.connect();
    console.log('Connected to Redis');
  } catch (error) {
    console.error('Error connecting to Redis:', error);
  }
};

export default connection;