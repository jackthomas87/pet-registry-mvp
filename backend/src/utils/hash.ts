import crypto from 'crypto';

/**
 * Generate a SHA-256 hash from data
 * Creates a deterministic hash for blockchain storage
 */
export function generateHash(data: Record<string, any>): string {
  // Convert object to sorted JSON string for consistency
  const sortedData = sortObject(data);
  const jsonString = JSON.stringify(sortedData);
  
  // Generate SHA-256 hash
  const hash = crypto.createHash('sha256').update(jsonString).digest('hex');
  
  return hash;
}

/**
 * Sort object keys recursively for consistent hashing
 */
function sortObject(obj: any): any {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(sortObject);
  }
  
  const sorted: Record<string, any> = {};
  Object.keys(obj)
    .sort()
    .forEach(key => {
      sorted[key] = sortObject(obj[key]);
    });
  
  return sorted;
}

/**
 * Generate hash for pet registration
 */
export function hashPetRegistration(petData: {
  microchipId: string;
  name: string;
  species: string;
  breed?: string;
  color?: string;
  birthdate?: Date | null;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
}): string {
  return generateHash({
    type: 'PET_REGISTRATION',
    microchipId: petData.microchipId,
    petName: petData.name,
    species: petData.species,
    breed: petData.breed || '',
    color: petData.color || '',
    birthdate: petData.birthdate ? petData.birthdate.toISOString() : '',
    ownerId: petData.ownerId,
    ownerName: petData.ownerName,
    ownerEmail: petData.ownerEmail,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Generate hash for ownership transfer
 */
export function hashOwnershipTransfer(transferData: {
  petId: string;
  microchipId: string;
  oldOwnerId: string;
  newOwnerId: string;
  transferDate: Date;
}): string {
  return generateHash({
    type: 'OWNERSHIP_TRANSFER',
    petId: transferData.petId,
    microchipId: transferData.microchipId,
    oldOwnerId: transferData.oldOwnerId,
    newOwnerId: transferData.newOwnerId,
    transferDate: transferData.transferDate.toISOString(),
    timestamp: new Date().toISOString(),
  });
}
