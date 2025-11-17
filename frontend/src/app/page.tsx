export default function HomePage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#212529' }}>Welcome to Pet Registry</h2>
        <p style={{ fontSize: '1.2rem', color: '#6c757d' }}>
          A decentralized, blockchain-backed system for registering and tracking pet microchips.
        </p>
      </div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '2rem',
        marginBottom: '3rem'
      }}>
        <div style={{ 
          backgroundColor: 'white', 
          padding: '2rem', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginTop: 0, color: '#007bff' }}>📝 Register Your Pet</h3>
          <p style={{ color: '#6c757d', lineHeight: '1.6' }}>
            Create a permanent, tamper-proof record of your pet's microchip registration with blockchain verification.
          </p>
          <a 
            href="/register" 
            style={{ 
              display: 'inline-block',
              marginTop: '1rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#007bff',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              fontWeight: 'bold'
            }}
          >
            Get Started →
          </a>
        </div>

        <div style={{ 
          backgroundColor: 'white', 
          padding: '2rem', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginTop: 0, color: '#007bff' }}>🔍 Look Up a Pet</h3>
          <p style={{ color: '#6c757d', lineHeight: '1.6' }}>
            Search for any registered pet using their microchip ID to view owner contact information.
          </p>
          <a 
            href="/lookup" 
            style={{ 
              display: 'inline-block',
              marginTop: '1rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#007bff',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              fontWeight: 'bold'
            }}
          >
            Search Now →
          </a>
        </div>
      </div>

      <div style={{ 
        backgroundColor: 'white', 
        padding: '2rem', 
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginTop: 0, color: '#212529' }}>Key Features:</h3>
        <ul style={{ color: '#6c757d', lineHeight: '1.8' }}>
          <li><strong>Blockchain Verification:</strong> All records are hashed and stored on Hedera for tamper-proof authenticity</li>
          <li><strong>Lost & Found Tracking:</strong> Mark pets as lost or found to help reunite them with owners</li>
          <li><strong>Owner Contact Info:</strong> Securely store and retrieve owner details for registered pets</li>
          <li><strong>Ownership Transfer:</strong> Transfer pet ownership with full blockchain audit trail</li>
          <li><strong>Permanent Records:</strong> Microchip registrations are permanent and globally accessible</li>
        </ul>
      </div>
    </div>
  )
}
