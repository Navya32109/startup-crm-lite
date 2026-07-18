import dotenv from 'dotenv';
// Load environment variables at the absolute top to ensure they are available for all modules
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import mongoose from 'mongoose';

// Database connection
import { connectDB } from './config/database.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import leadRoutes from './routes/leadRoutes.js';

// Middleware imports
import { errorHandler } from './middleware/errorHandler.js';

// ==========================================
// Environment Variables Validation
// ==========================================

/**
 * Validate that all required environment variables are present before starting.
 * Exits the process if any required variables are missing.
 */
const checkRequiredEnvVars = () => {
  const requiredVars = ['MONGODB_URI', 'JWT_SECRET', 'PORT'];
  const missingVars = [];

  requiredVars.forEach((varName) => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });

  if (missingVars.length > 0) {
    console.error(`[FATAL ERROR] Environment validation failed. Missing variables: ${missingVars.join(', ')}`);
    process.exit(1);
  }
};

// Initialize the Express application
const app = express();

// ==========================================
// Middleware Configuration
// ==========================================

// 1. Helmet security middleware to set various HTTP headers for security
app.use(helmet());

// 2. Request Logging based on environment (Morgan)
const NODE_ENV = process.env.NODE_ENV || 'development';
if (NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

// 3. CORS configuration to enable Cross-Origin Resource Sharing with production-ready origin validation
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://your-app.vercel.app'
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, postman, or same-origin)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};
app.use(cors(corsOptions));

// 4. Express body-parsers to read incoming JSON data (limited to 10kb to avoid DOS) and URL-encoded payloads
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// 5. MongoDB Injection Protection - sanitizes req.body, req.query, and req.params (must be placed after body-parsers)
app.use((req, res, next) => {
  if (req.body) mongoSanitize.sanitize(req.body);
  if (req.query) mongoSanitize.sanitize(req.query);
  if (req.params) mongoSanitize.sanitize(req.params);
  next();
});

// 6. Rate Limiting to prevent denial-of-service and brute force attacks
const isDev = process.env.NODE_ENV !== 'production';

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDev ? 5000 : 1000, // Limit each IP per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDev ? 1000 : 100, // Limit login/register attempts per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many auth attempts from this IP, please try again later.'
  }
});

// Apply rate limiters to paths
app.use('/api/', generalLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// ==========================================
// Route Registrations
// ==========================================

// Health Check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date(),
  });
});

// App Feature Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

// ==========================================
// Error Handling Middleware
// ==========================================

// Register error handler middleware LAST (after routes)
app.use(errorHandler);

// ==========================================
// Server Bootstrap & Graceful Shutdown
// ==========================================
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Validate environment variables first before connecting to database
  checkRequiredEnvVars();

  // 1. Connect to database
  await connectDB();

  // 2. Start listening for incoming connections
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${NODE_ENV} mode`);
  });
};

// Graceful Shutdown handlers
const shutdown = async (signal) => {
  console.log(`\nReceived ${signal}. Server shutting down gracefully...`);
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed cleanly.');
    process.exit(0);
  } catch (error) {
    console.error('Error during database disconnection on shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

startServer();
