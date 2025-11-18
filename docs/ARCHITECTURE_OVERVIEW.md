# Architecture Overview

## Monorepo Structure
- /backend → Fastify API + Prisma + Hedera services
- /frontend → Next.js app (TypeScript)
- /docs → project documentation

## Authentication
- Authentication will use NextAuth.js (Auth.js) with an Email provider (magic link)
- PrismaAdapter will persist user sessions and accounts in PostgreSQL
- Only authenticated users may register or manage their pets
- Pet lookup remains public and returns only limited, non-sensitive owner info

## Data Model (high level)
### User
- id (uuid)
- email (unique)
- name (optional)
- createdAt
- updatedAt

### Owner
- id (uuid)
- name
- createdAt
- updatedAt
- userId (fk → User.id)

### Pet
- id (uuid)
- microchipId (unique)
- name
- species
- breed
- color
- birthdate (optional)
- ownerId (fk → Owner.id)
- userId (fk → User.id)
- isLost (boolean)
- ledgerHash (string)
- createdAt
- updatedAt

### TransferOfOwnership
- id (uuid)
- petId (fk)
- oldOwnerId (fk → User.id)
- newOwnerId (fk → User.id)
- transferDate
- ledgerHash (string)

## Blockchain Integration (Hedera)
- Only hashes stored on-chain
- No full data stored on-chain
- Hashes used as immutable audit proof
- Store transaction ID in DB for traceability

## Core API Routes
POST /api/register-pet  
GET /api/pet/:microchipId  
POST /api/pet/:id/transfer  
POST /api/pet/:id/mark-lost  
POST /api/pet/:id/mark-found  

## Core User Flows
1. Register pet → store record → hash → Hedera → save ledgerHash  
2. Lookup pet by microchip ID  
3. Transfer ownership → hash transfer → Hedera  
4. Mark lost/found  