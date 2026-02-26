const path = require('path');
const envFilePath = path.resolve(__dirname, '../.env');
const dotenvResult = require('dotenv').config({ path: envFilePath });
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

const assertRequiredEnv = () => {
  if (dotenvResult.error) {
    console.error(`Failed to load environment file at ${envFilePath}`);
    console.error('Create it from .env.example and try again.');
    process.exit(1);
  }

  const missingVars = ['MONGO_URI', 'JWT_SECRET'].filter((name) => !process.env[name]);

  if (missingVars.length > 0) {
    console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
    console.error(`Update ${envFilePath} and restart the server.`);
    process.exit(1);
  }
};

const start = async () => {
  try {
    assertRequiredEnv();
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Backend running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

start();
