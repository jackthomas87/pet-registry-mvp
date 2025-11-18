# Authentication Setup - Installation Commands

## Frontend Dependencies
cd /Users/jackthomas1987/Desktop/2.Apps/pet-registry-mvp/frontend
npm install next-auth@beta @auth/prisma-adapter nodemailer
npm install --save-dev @types/nodemailer

## Backend - Run Prisma Migration
cd /Users/jackthomas1987/Desktop/2.Apps/pet-registry-mvp/backend
npx prisma migrate dev --name add_auth_models
npx prisma generate

## Environment Variables to Add

### Backend (.env)
# Add these to backend/.env:
# (Keep existing DATABASE_URL, PORT, HEDERA_* variables)

### Frontend (.env.local)
# Create frontend/.env.local with:
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-change-in-production
AUTH_TRUST_HOST=true

# Email Configuration (for development - logs to console)
EMAIL_SERVER_HOST=localhost
EMAIL_SERVER_PORT=1025
EMAIL_FROM=noreply@petregistry.local

# Database (same as backend)
DATABASE_URL="postgresql://jackthomas1987@localhost:5432/pet_registry?schema=public"

## Generate NEXTAUTH_SECRET
# Run this command to generate a secure secret:
openssl rand -base64 32
