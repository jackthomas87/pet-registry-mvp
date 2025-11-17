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

## Tech Stack
- Frontend: Next.js 14 (App Router, TypeScript)
- Backend: Node.js + Fastify + TypeScript
- ORM: Prisma
- Database: PostgreSQL (Supabase or Neon recommended)
- Blockchain Layer: Hedera (store SHA-256 hashes of records)

## Non-Goals for MVP
- No advanced auth
- No payments
- No mobile app
- No medical records
- No breeder/vet integrations yet

## Quality Expectations
- Clean, modular code
- Clear folder structure
- Prisma as single source of truth for DB schema
- Hashing and blockchain logic isolated in service files