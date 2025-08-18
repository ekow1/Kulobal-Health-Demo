import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { compress } from 'hono/compress';
import { timing } from 'hono/timing';


import dotenv from 'dotenv';

import { connectDB } from './config/database.js';
import authRouter from './routes/auth.js';
import paymentRouter from './routes/payments.js';
import orderRouter from './routes/orders.js';

// Load environment variables
dotenv.config();

const app = new Hono();

// Middleware
app.use('*', logger());
app.use('*', timing());
app.use('*', secureHeaders());
app.use('*', compress());
// Cookie parsing is built into Hono, no need for separate middleware

// CORS configuration
const corsOrigins = process.env.CORS_ORIGIN 
  ? [process.env.CORS_ORIGIN]
  : ['http://localhost:3000', 'https://demo.ekowlabs.space'];

app.use('*', cors({
  origin: corsOrigins,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Health check endpoint
app.get('/health', (c) => {
  return c.json({
    success: true,
    message: 'Kulobal Health API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint - API info
app.get('/', (c) => {
  return c.json({
    success: true,
    message: 'Kulobal Health API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      payments: '/api/payments',
      orders: '/api/orders'
    },
    timestamp: new Date().toISOString()
  });
});

// API routes
app.route('/api/auth', authRouter);
app.route('/api/payments', paymentRouter);
app.route('/api/orders', orderRouter);

// 404 handler
app.notFound((c) => {
  return c.json({
    success: false,
    message: 'Endpoint not found',
    path: c.req.path
  }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error('API Error:', err);
  
  if (err.message.includes('Validation')) {
    return c.json({
      success: false,
      message: 'Validation error',
      error: err.message
    }, 400);
  }
  
  if (err.message.includes('Unauthorized')) {
    return c.json({
      success: false,
      message: 'Unauthorized access'
    }, 401);
  }
  
  return c.json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  }, 500);
});

// Start server
const port = parseInt(process.env.PORT || '5000');

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    console.log(`🚀 Server starting on port ${port}...`);
    
    // Start the server
    const server = serve({
      fetch: app.fetch,
      port
    });
    
    console.log(`✅ Server running on http://localhost:${port}`);
    console.log(`📊 Health check: http://localhost:${port}/`);
    console.log(`🔐 Auth endpoints: http://localhost:${port}/api/auth`);
    console.log(`💳 Payment endpoints: http://localhost:${port}/api/payments`);
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start the server
startServer();
