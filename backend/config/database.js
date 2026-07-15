import mongoose from 'mongoose';
import dns from 'dns';
import dotenv from 'dotenv';

// Load environment variables if they haven't been loaded already
dotenv.config();

/**
 * Connects to MongoDB Atlas using the URI specified in the environment variables.
 * Exits the process with failure status (1) if connection fails.
 * 
 * @returns {Promise<void>} Resolves when connection is successful.
 */
export const connectDB = async () => {
  let mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.error('Database connection error: MONGODB_URI is not defined in environment variables.');
    process.exit(1);
  }

  mongoUri = mongoUri.trim();

  // Mongoose connection options requested
  const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  };

  // Modern Mongoose versions (v6+) enable these by default and throw if passed explicitly.
  // We delete them dynamically to prevent startup crashes.
  const connectOptions = { ...mongooseOptions };
  delete connectOptions.useNewUrlParser;
  delete connectOptions.useUnifiedTopology;

  try {
    // Note: In Mongoose v9.x, useNewUrlParser and useUnifiedTopology are set to true by default
    // and passing them explicitly as options throws a connection error.
    const conn = await mongoose.connect(mongoUri, connectOptions);

    console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    // If DNS resolution for SRV record fails, try falling back to public DNS servers
    if (error.message.includes('querySrv')) {
      console.warn('MongoDB connection failed due to SRV DNS resolution error. Retrying with Google Public DNS (8.8.8.8)...');
      try {
        dns.setServers(['8.8.8.8', '8.8.4.4']);
        const conn = await mongoose.connect(mongoUri, connectOptions);
        console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);
        return;
      } catch (retryError) {
        console.error(`MongoDB Connection Error (retry failed): ${retryError.message}`);
      }
    } else {
      console.error(`MongoDB Connection Error: ${error.message}`);
    }
    process.exit(1);
  }
};

export default connectDB;
