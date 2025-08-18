import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';

// Import routers
import authRouter from './routes/auth.js';

const app = new Hono();

// Debug: Log router import
console.log('Auth router imported:', typeof authRouter);
console.log('Auth router methods:', Object.keys(authRouter));

// CORS configuration
app.use('*', cors({
  origin: ['http://localhost:3000', 'https://demo.ekowlabs.space'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Health check endpoint
app.get('/health', (c) => {
  console.log('Health endpoint called');
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
    timestamp: new Date().toISOString()
  });
});

// Test endpoint
app.get('/test', (c) => {
  return c.json({
    success: true,
    message: 'Test endpoint working',
    timestamp: new Date().toISOString()
  });
});

// Mount auth routes
app.route('/api/auth', authRouter);

// 404 handler
app.notFound((c) => {
  return c.json({
    success: false,
    message: 'Endpoint not found',
    path: c.req.path
  }, 404);
});

// Start server
const port = parseInt(process.env.PORT || '5000');

const startServer = async () => {
  try {
    console.log(`🚀 Server starting on port ${port}...`);
    console.log('Environment check:', {
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
      CORS_ORIGIN: process.env.CORS_ORIGIN
    });
    
    // Start the server
    const server = serve({
      fetch: app.fetch,
      port
    });
    
    console.log(`✅ Server running on http://localhost:${port}`);
    console.log('Server object:', server);
    
    // Keep the process alive
    setInterval(() => {
      console.log('Server heartbeat - still running');
    }, 30000); // Log every 30 seconds
    
    process.on('uncaughtException', (err) => {
      console.error('Uncaught Exception:', err);
    });
    
    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    console.error('Error stack:', error.stack);
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
