# Architecture Overview

## Monorepo Structure
- /backend → Fastify API + Prisma + Hedera services
- /frontend → Next.js app (TypeScript)
- /docs → project documentation

## Data Model (high level)
### Owner
- id (uuid)
- name
- email
- phone
- address
- createdAt
- updatedAt

### Pet
- id (uuid)
- microchipId (unique)
- name
- species
- breed
- color
- birthdate (optional)
- ownerId (fk)
- isLost (boolean)
- ledgerHash (string)
- createdAt
- updatedAt

### TransferOfOwnership
- id (uuid)
- petId (fk)
- oldOwnerId (fk)
- newOwnerId (fk)
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