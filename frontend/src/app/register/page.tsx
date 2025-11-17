'use client';

import { useState } from 'react';
import { registerPet, type RegisterPetData } from '@/lib/api';

export default function RegisterPage() {
  const [formData, setFormData] = useState<RegisterPetData>({
    ownerName: '',
    ownerEmail: '',
    ownerPhone: '',
    ownerAddress: '',
    microchipId: '',
    petName: '',
    species: '',
    breed: '',
    color: '',
    birthdate: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [blockchainTxId, setBlockchainTxId] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const result = await registerPet(formData);
      setSuccess(true);
      
      // Store blockchain transaction ID if available
      if (result.pet.ledgerHash) {
        setBlockchainTxId(result.pet.ledgerHash);
      }
      
      // Reset form
      setFormData({
        ownerName: '',
        ownerEmail: '',
        ownerPhone: '',
        ownerAddress: '',
        microchipId: '',
        petName: '',
        species: '',
        breed: '',
        color: '',
        birthdate: '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register pet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>Register Your Pet</h2>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Register your pet's microchip to create a permanent, blockchain-verified record.
      </p>

      {success && (
        <div style={{ padding: '1rem', backgroundColor: '#d4edda', color: '#155724', borderRadius: '4px', marginBottom: '1rem' }}>
          <div style={{ marginBottom: '0.5rem' }}>
            ✅ Pet registered successfully! You can now <a href="/lookup" style={{ color: '#155724', textDecoration: 'underline' }}>look up your pet</a>.
          </div>
          {blockchainTxId && (
            <div style={{ fontSize: '0.9rem', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid #c3e6cb' }}>
              🔒 <strong>Blockchain Verified:</strong>{' '}
              <a 
                href={`https://hashscan.io/testnet/transaction/${blockchainTxId}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#155724', textDecoration: 'underline' }}
              >
                View on Hedera ↗
              </a>
            </div>
          )}
        </div>
      )}

      {error && (
        <div style={{ padding: '1rem', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px', marginBottom: '1rem' }}>
          ❌ {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <fieldset style={{ border: '1px solid #ddd', padding: '1.5rem', borderRadius: '4px', marginBottom: '1.5rem' }}>
          <legend style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Owner Information</legend>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Full Name *
            </label>
            <input
              type="text"
              name="ownerName"
              value={formData.ownerName}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '0.5rem', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Email Address *
            </label>
            <input
              type="email"
              name="ownerEmail"
              value={formData.ownerEmail}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '0.5rem', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Phone Number
            </label>
            <input
              type="tel"
              name="ownerPhone"
              value={formData.ownerPhone}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.5rem', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Address
            </label>
            <input
              type="text"
              name="ownerAddress"
              value={formData.ownerAddress}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.5rem', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
        </fieldset>

        <fieldset style={{ border: '1px solid #ddd', padding: '1.5rem', borderRadius: '4px', marginBottom: '1.5rem' }}>
          <legend style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Pet Information</legend>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Microchip ID *
            </label>
            <input
              type="text"
              name="microchipId"
              value={formData.microchipId}
              onChange={handleChange}
              required
              placeholder="e.g., 123456789012345"
              style={{ width: '100%', padding: '0.5rem', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Pet Name *
            </label>
            <input
              type="text"
              name="petName"
              value={formData.petName}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '0.5rem', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Species *
            </label>
            <select
              name="species"
              value={formData.species}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '0.5rem', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="">Select species...</option>
              <option value="Dog">Dog</option>
              <option value="Cat">Cat</option>
              <option value="Bird">Bird</option>
              <option value="Rabbit">Rabbit</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Breed
            </label>
            <input
              type="text"
              name="breed"
              value={formData.breed}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.5rem', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Color
            </label>
            <input
              type="text"
              name="color"
              value={formData.color}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.5rem', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Birth Date
            </label>
            <input
              type="date"
              name="birthdate"
              value={formData.birthdate}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.5rem', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
        </fieldset>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '1rem',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Registering...' : 'Register Pet'}
        </button>
      </form>
    </div>
  );
}
