import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import { petRoutes } from './routes/pet.routes';

// Load environment variables
dotenv.config();

const PORT = parseInt(process.env.PORT || '3001', 10);

// Initialize Fastify server
const server = Fastify({
  logger: {
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
});

// Register CORS
server.register(cors, {
  origin: true, // Allow all origins for MVP (restrict in production)
});

// Register routes
server.register(petRoutes);

// Health check route
server.get('/health', async (request, reply) => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// Root route
server.get('/', async (request, reply) => {
  return {
    message: 'Pet Registry API - MVP',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      registerPet: 'POST /api/register-pet',
      lookupPet: 'GET /api/pet/:microchipId',
      transferOwnership: 'POST /api/pet/:id/transfer',
      markLost: 'POST /api/pet/:id/mark-lost',
      markFound: 'POST /api/pet/:id/mark-found',
    },
  };
});

// Start server
const start = async () => {
  try {
    await server.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
