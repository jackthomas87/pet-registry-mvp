import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../utils/prisma';
import { hashPetRegistration, hashOwnershipTransfer } from '../utils/hash';
import { submitPetRegistration, submitOwnershipTransfer } from '../services/hedera.service';

// Type definitions for request bodies
interface RegisterPetBody {
  // Owner info
  ownerName: string;
  ownerEmail: string;
  ownerPhone?: string;
  ownerAddress?: string;
  
  // Pet info
  microchipId: string;
  petName: string;
  species: string;
  breed?: string;
  color?: string;
  birthdate?: string;
}

interface MarkLostFoundBody {
  isLost: boolean;
}

interface TransferOwnershipBody {
  newOwnerName: string;
  newOwnerEmail: string;
  newOwnerPhone?: string;
  newOwnerAddress?: string;
}

export async function petRoutes(fastify: FastifyInstance) {
  
  // POST /api/register-pet - Register a new pet
  fastify.post(
    '/api/register-pet',
    async (request: FastifyRequest<{ Body: RegisterPetBody }>, reply: FastifyReply) => {
      try {
        const {
          ownerName,
          ownerEmail,
          ownerPhone,
          ownerAddress,
          microchipId,
          petName,
          species,
          breed,
          color,
          birthdate,
        } = request.body;

        // Validate required fields
        if (!ownerName || !ownerEmail || !microchipId || !petName || !species) {
          return reply.status(400).send({
            error: 'Missing required fields',
            required: ['ownerName', 'ownerEmail', 'microchipId', 'petName', 'species'],
          });
        }

        // Check if microchip ID already exists
        const existingPet = await prisma.pet.findUnique({
          where: { microchipId },
        });

        if (existingPet) {
          return reply.status(409).send({
            error: 'Microchip ID already registered',
            microchipId,
          });
        }

        // Find or create owner by email
        let owner = await prisma.owner.findUnique({
          where: { email: ownerEmail },
        });

        if (!owner) {
          owner = await prisma.owner.create({
            data: {
              name: ownerName,
              email: ownerEmail,
              phone: ownerPhone,
              address: ownerAddress,
            },
          });
        }

        // Create pet
        const pet = await prisma.pet.create({
          data: {
            microchipId,
            name: petName,
            species,
            breed,
            color,
            birthdate: birthdate ? new Date(birthdate) : null,
            ownerId: owner.id,
          },
          include: {
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                address: true,
              },
            },
          },
        });

        // Generate hash and submit to Hedera
        let ledgerHash: string | null = null;
        try {
          const hash = hashPetRegistration({
            microchipId: pet.microchipId,
            name: pet.name,
            species: pet.species,
            breed: pet.breed || undefined,
            color: pet.color || undefined,
            birthdate: pet.birthdate,
            ownerId: owner.id,
            ownerName: owner.name,
            ownerEmail: owner.email,
          });

          // Submit to Hedera and get transaction ID
          const transactionId = await submitPetRegistration(pet.microchipId, hash);
          ledgerHash = transactionId;

          // Update pet with ledger hash
          await prisma.pet.update({
            where: { id: pet.id },
            data: { ledgerHash },
          });

          fastify.log.info(`Pet registered with blockchain verification: ${transactionId}`);
        } catch (hederaError) {
          fastify.log.error('Failed to submit to Hedera:', hederaError);
          // Continue without blockchain verification (don't fail the registration)
        }

        return reply.status(201).send({
          message: 'Pet registered successfully',
          pet: {
            ...pet,
            ledgerHash,
          },
          blockchain: ledgerHash ? {
            verified: true,
            transactionId: ledgerHash,
            explorerUrl: `https://hashscan.io/testnet/transaction/${ledgerHash}`,
          } : {
            verified: false,
            message: 'Blockchain verification pending or failed',
          },
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({
          error: 'Failed to register pet',
          details: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  );

  // GET /api/pet/:microchipId - Look up pet by microchip ID
  fastify.get(
    '/api/pet/:microchipId',
    async (request: FastifyRequest<{ Params: { microchipId: string } }>, reply: FastifyReply) => {
      try {
        const { microchipId } = request.params;

        const pet = await prisma.pet.findUnique({
          where: { microchipId },
          include: {
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                address: true,
              },
            },
            transfers: {
              orderBy: { transferDate: 'desc' },
              take: 5,
              include: {
                oldOwner: {
                  select: {
                    name: true,
                    email: true,
                  },
                },
                newOwner: {
                  select: {
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        });

        if (!pet) {
          return reply.status(404).send({
            error: 'Pet not found',
            microchipId,
          });
        }

        return reply.status(200).send({
          pet,
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({
          error: 'Failed to retrieve pet',
          details: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  );

  // POST /api/pet/:id/mark-lost - Mark pet as lost
  fastify.post(
    '/api/pet/:id/mark-lost',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      try {
        const { id } = request.params;

        const pet = await prisma.pet.update({
          where: { id },
          data: { isLost: true },
          include: {
            owner: {
              select: {
                name: true,
                email: true,
                phone: true,
              },
            },
          },
        });

        return reply.status(200).send({
          message: 'Pet marked as lost',
          pet,
        });
      } catch (error) {
        fastify.log.error(error);
        
        if (error instanceof Error && error.message.includes('Record to update not found')) {
          return reply.status(404).send({
            error: 'Pet not found',
          });
        }

        return reply.status(500).send({
          error: 'Failed to mark pet as lost',
          details: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  );

  // POST /api/pet/:id/mark-found - Mark pet as found
  fastify.post(
    '/api/pet/:id/mark-found',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      try {
        const { id } = request.params;

        const pet = await prisma.pet.update({
          where: { id },
          data: { isLost: false },
          include: {
            owner: {
              select: {
                name: true,
                email: true,
                phone: true,
              },
            },
          },
        });

        return reply.status(200).send({
          message: 'Pet marked as found',
          pet,
        });
      } catch (error) {
        fastify.log.error(error);
        
        if (error instanceof Error && error.message.includes('Record to update not found')) {
          return reply.status(404).send({
            error: 'Pet not found',
          });
        }

        return reply.status(500).send({
          error: 'Failed to mark pet as found',
          details: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  );

  // POST /api/pet/:id/transfer - Transfer ownership
  fastify.post(
    '/api/pet/:id/transfer',
    async (request: FastifyRequest<{ Params: { id: string }; Body: TransferOwnershipBody }>, reply: FastifyReply) => {
      try {
        const { id } = request.params;
        const { newOwnerName, newOwnerEmail, newOwnerPhone, newOwnerAddress } = request.body;

        // Validate required fields
        if (!newOwnerName || !newOwnerEmail) {
          return reply.status(400).send({
            error: 'Missing required fields',
            required: ['newOwnerName', 'newOwnerEmail'],
          });
        }

        // Get current pet with owner
        const pet = await prisma.pet.findUnique({
          where: { id },
          include: {
            owner: true,
          },
        });

        if (!pet) {
          return reply.status(404).send({
            error: 'Pet not found',
          });
        }

        const oldOwnerId = pet.ownerId;

        // Check if new owner email is same as current owner
        if (pet.owner.email === newOwnerEmail) {
          return reply.status(400).send({
            error: 'New owner cannot be the same as current owner',
          });
        }

        // Find or create new owner
        let newOwner = await prisma.owner.findUnique({
          where: { email: newOwnerEmail },
        });

        if (!newOwner) {
          newOwner = await prisma.owner.create({
            data: {
              name: newOwnerName,
              email: newOwnerEmail,
              phone: newOwnerPhone,
              address: newOwnerAddress,
            },
          });
        }

        // Create transfer record and update pet owner
        const transfer = await prisma.transferOfOwnership.create({
          data: {
            petId: pet.id,
            oldOwnerId: oldOwnerId,
            newOwnerId: newOwner.id,
            transferDate: new Date(),
          },
          include: {
            pet: true,
            oldOwner: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            newOwner: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        });

        // Update pet's owner
        await prisma.pet.update({
          where: { id },
          data: { ownerId: newOwner.id },
        });

        // Generate hash and submit to Hedera
        let ledgerHash: string | null = null;
        try {
          const hash = hashOwnershipTransfer({
            petId: pet.id,
            microchipId: pet.microchipId,
            oldOwnerId: oldOwnerId,
            newOwnerId: newOwner.id,
            transferDate: transfer.transferDate,
          });

          // Submit to Hedera
          const transactionId = await submitOwnershipTransfer(
            pet.id,
            pet.microchipId,
            hash
          );
          ledgerHash = transactionId;

          // Update transfer with ledger hash
          await prisma.transferOfOwnership.update({
            where: { id: transfer.id },
            data: { ledgerHash },
          });

          fastify.log.info(`Ownership transfer recorded on blockchain: ${transactionId}`);
        } catch (hederaError) {
          fastify.log.error('Failed to submit transfer to Hedera:', hederaError);
          // Continue without blockchain verification
        }

        return reply.status(200).send({
          message: 'Ownership transferred successfully',
          transfer: {
            ...transfer,
            ledgerHash,
          },
          blockchain: ledgerHash ? {
            verified: true,
            transactionId: ledgerHash,
            explorerUrl: `https://hashscan.io/testnet/transaction/${ledgerHash}`,
          } : {
            verified: false,
            message: 'Blockchain verification pending or failed',
          },
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({
          error: 'Failed to transfer ownership',
          details: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  );
}
