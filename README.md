# 🐾 Decentralized Pet Registry - MVP

A blockchain-backed pet microchip registration system using Hedera for tamper-proof record keeping.

## 📋 Overview

This MVP allows pet owners to:
- Register pets with microchip IDs
- Store owner contact information
- Look up pets by microchip ID
- Mark pets as lost/found
- Transfer ownership with blockchain verification

## 🏗️ Architecture

**Monorepo Structure:**
- `/backend` - Fastify API + Prisma ORM + Hedera integration
- `/frontend` - Next.js 14 (App Router) with TypeScript
- `/docs` - Project documentation

**Tech Stack:**
- Backend: Node.js, Fastify, TypeScript, Prisma
- Frontend: Next.js 14, React, TypeScript
- Database: PostgreSQL (via Supabase or Neon)
- Blockchain: Hedera (hash storage for tamper-proof records)

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database (Supabase/Neon recommended)
- Hedera testnet account (for blockchain features)

### Backend Setup

1. Navigate to backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file from example:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your database URL and Hedera credentials

5. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

6. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

7. Start the backend server:
   ```bash
   npm run dev
   ```

   Backend should now be running on `http://localhost:3001`

### Frontend Setup

1. Navigate to frontend folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env.local` file from example:
   ```bash
   cp .env.local.example .env.local
   ```

4. Start the frontend:
   ```bash
   npm run dev
   ```

   Frontend should now be running on `http://localhost:3000`

## 📚 Documentation

See `/docs` folder for:
- `PROJECT_CHARTER.md` - Project goals and scope
- `ARCHITECTURE_OVERVIEW.md` - System architecture details
- `PROGRESS_LOG.md` - Development progress tracking

## 🔧 Development Scripts

### Backend
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Run production build
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio (database GUI)

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Run production build
- `npm run lint` - Run ESLint

## 📝 API Endpoints (Coming Soon)

- `POST /api/register-pet` - Register a new pet
- `GET /api/pet/:microchipId` - Look up pet by microchip ID
- `POST /api/pet/:id/transfer` - Transfer ownership
- `POST /api/pet/:id/mark-lost` - Mark pet as lost
- `POST /api/pet/:id/mark-found` - Mark pet as found

## 🎯 Current Status

✅ Session 1 Complete - Project scaffolding
- Monorepo structure created
- Backend with Fastify + Prisma configured
- Frontend with Next.js 14 configured
- Database schema defined
- Basic routing scaffolded

⏳ Next Steps:
- Set up actual database connection
- Implement API routes
- Build Hedera integration
- Create frontend forms and pages

## 📄 License

MIT
