import type { Metadata } from 'next'
import { AuthProvider } from '@/components/AuthProvider'

export const metadata: Metadata = {
  title: 'Pet Registry - Decentralized Pet Microchip Registry',
  description: 'A blockchain-backed pet microchip registration system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: '#f8f9fa' }}>
        <AuthProvider>
          <header style={{ 
            padding: '1rem 2rem', 
            backgroundColor: '#007bff', 
            color: 'white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h1 style={{ margin: 0, fontSize: '1.5rem' }}>🐾 Pet Registry</h1>
              <nav style={{ display: 'flex', gap: '1.5rem' }}>
                <a href="/" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Home</a>
                <a href="/register" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Register Pet</a>
                <a href="/lookup" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Lookup Pet</a>
                <a href="/auth/signin" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Sign In</a>
              </nav>
            </div>
          </header>
          <main style={{ 
            padding: '2rem', 
            minHeight: 'calc(100vh - 180px)',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {children}
          </main>
          <footer style={{ 
            padding: '1.5rem', 
            borderTop: '1px solid #dee2e6', 
            backgroundColor: 'white',
            textAlign: 'center',
            color: '#6c757d'
          }}>
            <p style={{ margin: 0 }}>© 2024 Pet Registry MVP - Powered by Hedera Blockchain</p>
          </footer>
        </AuthProvider>
      </body>
    </html>
  )
}
