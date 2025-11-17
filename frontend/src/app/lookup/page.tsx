'use client';

import { useState } from 'react';
import { lookupPet, markPetLost, markPetFound, transferOwnership, type Pet, type TransferOwnershipData } from '@/lib/api';

export default function LookupPage() {
  const [microchipId, setMicrochipId] = useState('');
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [transferData, setTransferData] = useState<TransferOwnershipData>({
    newOwnerName: '',
    newOwnerEmail: '',
    newOwnerPhone: '',
    newOwnerAddress: '',
  });
  const [transferSuccess, setTransferSuccess] = useState(false);
  const [blockchainTxId, setBlockchainTxId] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPet(null);

    try {
      const result = await lookupPet(microchipId);
      setPet(result.pet);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to lookup pet');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkLost = async () => {
    if (!pet) return;
    setActionLoading(true);
    setError('');

    try {
      const result = await markPetLost(pet.id);
      setPet(result.pet);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark pet as lost');
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkFound = async () => {
    if (!pet) return;
    setActionLoading(true);
    setError('');

    try {
      const result = await markPetFound(pet.id);
      setPet(result.pet);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark pet as found');
    } finally {
      setActionLoading(false);
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pet) return;
    setActionLoading(true);
    setError('');
    setTransferSuccess(false);

    try {
      const result = await transferOwnership(pet.id, transferData);
      setTransferSuccess(true);
      if (result.blockchain?.transactionId) {
        setBlockchainTxId(result.blockchain.transactionId);
      }
      // Refresh pet data
      const updatedPet = await lookupPet(pet.microchipId);
      setPet(updatedPet.pet);
      setShowTransferForm(false);
      // Reset form
      setTransferData({
        newOwnerName: '',
        newOwnerEmail: '',
        newOwnerPhone: '',
        newOwnerAddress: '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to transfer ownership');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <h2>Look Up Pet by Microchip</h2>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Enter a microchip ID to retrieve pet registration details.
      </p>

      <form onSubmit={handleSearch} style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            value={microchipId}
            onChange={(e) => setMicrochipId(e.target.value)}
            placeholder="Enter microchip ID..."
            required
            style={{
              flex: 1,
              padding: '0.75rem',
              fontSize: '1rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              fontWeight: 'bold',
              backgroundColor: loading ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {error && (
        <div style={{ padding: '1rem', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px', marginBottom: '1rem' }}>
          ❌ {error}
        </div>
      )}

      {transferSuccess && blockchainTxId && (
        <div style={{ padding: '1rem', backgroundColor: '#d4edda', color: '#155724', borderRadius: '4px', marginBottom: '1rem' }}>
          <div style={{ marginBottom: '0.5rem' }}>
            ✅ Ownership transferred successfully!
          </div>
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
        </div>
      )}

      {pet && (
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1.5rem' }}>
          {/* Lost/Found Status Banner */}
          {pet.isLost && (
            <div style={{ padding: '1rem', backgroundColor: '#fff3cd', color: '#856404', borderRadius: '4px', marginBottom: '1rem', fontWeight: 'bold' }}>
              ⚠️ THIS PET IS MARKED AS LOST
            </div>
          )}

          {!pet.isLost && (
            <div style={{ padding: '1rem', backgroundColor: '#d4edda', color: '#155724', borderRadius: '4px', marginBottom: '1rem', fontWeight: 'bold' }}>
              ✅ This pet is registered and not lost
            </div>
          )}

          {/* Pet Information */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginTop: 0, marginBottom: '1rem', borderBottom: '2px solid #007bff', paddingBottom: '0.5rem' }}>
              Pet Information
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '0.75rem' }}>
              <strong>Name:</strong>
              <span>{pet.name}</span>

              <strong>Microchip ID:</strong>
              <span style={{ fontFamily: 'monospace', backgroundColor: '#f5f5f5', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                {pet.microchipId}
              </span>

              <strong>Species:</strong>
              <span>{pet.species}</span>

              {pet.breed && (
                <>
                  <strong>Breed:</strong>
                  <span>{pet.breed}</span>
                </>
              )}

              {pet.color && (
                <>
                  <strong>Color:</strong>
                  <span>{pet.color}</span>
                </>
              )}

              {pet.birthdate && (
                <>
                  <strong>Birth Date:</strong>
                  <span>{new Date(pet.birthdate).toLocaleDateString()}</span>
                </>
              )}

              <strong>Registered:</strong>
              <span>{new Date(pet.createdAt).toLocaleDateString()}</span>

              {pet.ledgerHash && (
                <>
                  <strong>Blockchain:</strong>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: '#28a745', fontWeight: 'bold' }}>✓ Verified</span>
                    <a 
                      href={`https://hashscan.io/testnet/transaction/${pet.ledgerHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ 
                        color: '#007bff', 
                        textDecoration: 'underline',
                        fontSize: '0.9rem'
                      }}
                    >
                      View on Hedera ↗
                    </a>
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Owner Information */}
          {pet.owner && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ marginTop: 0, marginBottom: '1rem', borderBottom: '2px solid #007bff', paddingBottom: '0.5rem' }}>
                Current Owner Contact Information
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '0.75rem' }}>
                <strong>Name:</strong>
                <span>{pet.owner.name}</span>

                <strong>Email:</strong>
                <span>
                  <a href={`mailto:${pet.owner.email}`} style={{ color: '#007bff', textDecoration: 'underline' }}>
                    {pet.owner.email}
                  </a>
                </span>

                {pet.owner.phone && (
                  <>
                    <strong>Phone:</strong>
                    <span>
                      <a href={`tel:${pet.owner.phone}`} style={{ color: '#007bff', textDecoration: 'underline' }}>
                        {pet.owner.phone}
                      </a>
                    </span>
                  </>
                )}

                {pet.owner.address && (
                  <>
                    <strong>Address:</strong>
                    <span>{pet.owner.address}</span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Transfer History */}
          {pet.transfers && pet.transfers.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ marginTop: 0, marginBottom: '1rem', borderBottom: '2px solid #007bff', paddingBottom: '0.5rem' }}>
                Ownership Transfer History
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {pet.transfers.map((transfer: any, index: number) => (
                  <div 
                    key={transfer.id} 
                    style={{ 
                      padding: '1rem', 
                      backgroundColor: '#f8f9fa', 
                      borderRadius: '4px',
                      borderLeft: '4px solid #007bff'
                    }}
                  >
                    <div style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: '#6c757d' }}>
                      Transfer #{pet.transfers.length - index} - {new Date(transfer.transferDate).toLocaleDateString()}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '1rem', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '0.85rem', color: '#6c757d', marginBottom: '0.25rem' }}>From:</div>
                        <div style={{ fontWeight: 'bold' }}>{transfer.oldOwner.name}</div>
                        <div style={{ fontSize: '0.9rem', color: '#6c757d' }}>{transfer.oldOwner.email}</div>
                      </div>
                      <div style={{ fontSize: '1.5rem', color: '#007bff' }}>→</div>
                      <div>
                        <div style={{ fontSize: '0.85rem', color: '#6c757d', marginBottom: '0.25rem' }}>To:</div>
                        <div style={{ fontWeight: 'bold' }}>{transfer.newOwner.name}</div>
                        <div style={{ fontSize: '0.9rem', color: '#6c757d' }}>{transfer.newOwner.email}</div>
                      </div>
                    </div>
                    {transfer.ledgerHash && (
                      <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #dee2e6' }}>
                        <span style={{ color: '#28a745', fontSize: '0.9rem', fontWeight: 'bold' }}>✓ Blockchain Verified</span>
                        {' - '}
                        <a 
                          href={`https://hashscan.io/testnet/transaction/${transfer.ledgerHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: '#007bff', textDecoration: 'underline', fontSize: '0.9rem' }}
                        >
                          View on Hedera ↗
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ borderTop: '1px solid #ddd', paddingTop: '1.5rem' }}>
            <h4 style={{ marginTop: 0, marginBottom: '1rem' }}>Actions</h4>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              {pet.isLost ? (
                <button
                  onClick={handleMarkFound}
                  disabled={actionLoading}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    backgroundColor: actionLoading ? '#ccc' : '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: actionLoading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {actionLoading ? 'Updating...' : '✅ Mark as Found'}
                </button>
              ) : (
                <button
                  onClick={handleMarkLost}
                  disabled={actionLoading}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    backgroundColor: actionLoading ? '#ccc' : '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: actionLoading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {actionLoading ? 'Updating...' : '⚠️ Mark as Lost'}
                </button>
              )}
            </div>

            <button
              onClick={() => setShowTransferForm(!showTransferForm)}
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '1rem',
                fontWeight: 'bold',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              {showTransferForm ? '❌ Cancel Transfer' : '🔄 Transfer Ownership'}
            </button>

            {showTransferForm && (
              <form onSubmit={handleTransfer} style={{ marginTop: '1.5rem', padding: '1.5rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                <h5 style={{ marginTop: 0, marginBottom: '1rem' }}>Transfer to New Owner</h5>
                
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    New Owner Name *
                  </label>
                  <input
                    type="text"
                    value={transferData.newOwnerName}
                    onChange={(e) => setTransferData({ ...transferData, newOwnerName: e.target.value })}
                    required
                    style={{ width: '100%', padding: '0.5rem', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc' }}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    New Owner Email *
                  </label>
                  <input
                    type="email"
                    value={transferData.newOwnerEmail}
                    onChange={(e) => setTransferData({ ...transferData, newOwnerEmail: e.target.value })}
                    required
                    style={{ width: '100%', padding: '0.5rem', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc' }}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    New Owner Phone
                  </label>
                  <input
                    type="tel"
                    value={transferData.newOwnerPhone}
                    onChange={(e) => setTransferData({ ...transferData, newOwnerPhone: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc' }}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    New Owner Address
                  </label>
                  <input
                    type="text"
                    value={transferData.newOwnerAddress}
                    onChange={(e) => setTransferData({ ...transferData, newOwnerAddress: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={actionLoading}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    backgroundColor: actionLoading ? '#ccc' : '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: actionLoading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {actionLoading ? 'Transferring...' : '✅ Confirm Transfer'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
