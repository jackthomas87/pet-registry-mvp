// API client for communicating with backend

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

export interface Owner {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface Pet {
  id: string;
  microchipId: string;
  name: string;
  species: string;
  breed?: string;
  color?: string;
  birthdate?: string;
  isLost: boolean;
  ledgerHash?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  owner?: Owner;
}

export interface RegisterPetData {
  ownerName: string;
  ownerEmail: string;
  ownerPhone?: string;
  ownerAddress?: string;
  microchipId: string;
  petName: string;
  species: string;
  breed?: string;
  color?: string;
  birthdate?: string;
}

export interface TransferOwnershipData {
  newOwnerName: string;
  newOwnerEmail: string;
  newOwnerPhone?: string;
  newOwnerAddress?: string;
}

// Register a new pet
export async function registerPet(data: RegisterPetData): Promise<{ message: string; pet: Pet }> {
  const response = await fetch(`${API_URL}/api/register-pet`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to register pet');
  }

  return response.json();
}

// Look up pet by microchip ID
export async function lookupPet(microchipId: string): Promise<{ pet: Pet }> {
  const response = await fetch(`${API_URL}/api/pet/${microchipId}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to lookup pet');
  }

  return response.json();
}

// Mark pet as lost
export async function markPetLost(petId: string): Promise<{ message: string; pet: Pet }> {
  const response = await fetch(`${API_URL}/api/pet/${petId}/mark-lost`, {
    method: 'POST',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to mark pet as lost');
  }

  return response.json();
}

// Mark pet as found
export async function markPetFound(petId: string): Promise<{ message: string; pet: Pet }> {
  const response = await fetch(`${API_URL}/api/pet/${petId}/mark-found`, {
    method: 'POST',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to mark pet as found');
  }

  return response.json();
}

// Transfer ownership
export async function transferOwnership(
  petId: string,
  data: TransferOwnershipData
): Promise<{ message: string; transfer: any; blockchain: any }> {
  const response = await fetch(`${API_URL}/api/pet/${petId}/transfer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to transfer ownership');
  }

  return response.json();
}
