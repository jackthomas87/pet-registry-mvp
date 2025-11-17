# Decentralized Pet Registry MVP

This repository contains the early work on a decentralized microchip registry for pets.  
The goal of the MVP is to allow:

- Pet registration with microchip ID
- Owner contact storage
- Public lookup of a pet by microchip ID
- Basic lost/found status
- Ownership transfer
- Hashing key records and storing hashes on Hedera for tamper-proof proof

### Tech Stack (MVP)

- **Frontend:** Next.js 14 (App Router, TypeScript)
- **Backend:** Node.js (Fastify, TypeScript)
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Blockchain:** Hedera (storing SHA-256 hashes only)

### Project Documentation

- `/docs/PROJECT_CHARTER.md`  
- `/docs/ARCHITECTURE_OVERVIEW.md`  
- `/docs/PROGRESS_LOG.md` (updated by the AI development flow)

### Development Approach

The project is built with assistance from AI:
- ChatGPT helps with architecture, planning, and instruction clarity.
- Claude in VS Code handles code generation and repo-level execution.

### Status

MVP setup is in progress.
Backend and frontend scaffolding will be generated next using Claude.
