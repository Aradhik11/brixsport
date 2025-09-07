// src/app.ts
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import { createServer } from 'http';
import { specs, swaggerUi } from './config/swagger';
import pool, { createTables } from './config/database';
import { SocketService } from './services/socketServices';
import { errorHandler, notFound } from './middlewares/errorHandlers';
import { seedDatabase } from './utils/seed';

// Import routes
import homeRoutes from './routes/home';
import competitionRoutes from './routes/competitions';
import trackRoutes from './routes/track';
import favoritesRoutes from './routes/favorites';
import teamRoutes from './routes/teams';
import matchRoutes from './routes/matches';
import createLiveRoutes from './routes/live';

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 3000;
const NODE_ENV = 'development';

// Initialize Socket.IO
const socketService = new SocketService(server);

// Middleware
app.use(helmet());
app.use(cors({
  origin: true, 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({
    message: 'Brixsport Football API',
    status: 'running',
    version: '1.0.0',
    endpoints: {
      matches: '/api/matches',
      competitions: '/api/competitions',
      docs: '/api-docs'
    }
  });
});

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'BrixSports API Documentation'
}));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'BrixSports API is running!', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API Routes
app.use('/api', homeRoutes);
app.use('/api/competitions', competitionRoutes);
app.use('/api/track', trackRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/live', createLiveRoutes(socketService));

// Error handling
app.use(notFound);
app.use(errorHandler);

// Database initialization and server startup
const startServer = async () => {
  try {
    // Test database connection
    const client = await pool.connect();
    console.log('✅ Database connected successfully');
    
    // Create tables
    await client.query(createTables);
    console.log('✅ Database tables created/verified');
    
    client.release();

    // Seed database with sample data (only in development)
    if (NODE_ENV) {
      await seedDatabase();
    }

    // Start server
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📖 API Documentation: http://localhost:${PORT}/api-docs`);
      console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
});

startServer();

export default app;