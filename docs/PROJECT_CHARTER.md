# Project Charter – Decentralized Pet Registry MVP

## Objective
Build a minimal, working MVP of a decentralized pet microchip registration system.

The MVP must allow:
- Pet registration with microchip ID
- Owner contact info storage
- Lookup of a pet by microchip ID (public)
- Basic “lost/found” status
- Ownership transfer
- Hashing key records and storing hashes on Hedera for tamper-proof proof
- A minimal authentication layer with email-based account creation (magic link) so owners can log in and manage their pets

## Tech Stack
- Frontend: Next.js 14 (App Router, TypeScript)
- Backend: Node.js + Fastify + TypeScript
- ORM: Prisma
- Database: PostgreSQL (Supabase or Neon recommended)
- Blockchain Layer: Hedera (store SHA-256 hashes of records)
- Authentication: NextAuth.js (Auth.js) with Email provider and Prisma adapter

## Non-Goals for MVP
- No payments
- No mobile app
- No medical records
- No breeder/vet integrations yet

## Authentication Requirements
- Users must be able to create an account via email-based login (magic link)
- Only authenticated users may register or update their pets
- Pet lookup remains public but does not expose sensitive owner data

## Quality Expectations
- Clean, modular code
- Clear folder structure
- Prisma as single source of truth for DB schema
- Hashing and blockchain logic isolated in service files