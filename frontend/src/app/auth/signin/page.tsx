'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn('email', {
        email,
        redirect: false,
        callbackUrl,
      });

      if (result?.ok) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ maxWidth: '500px', margin: '4rem auto', padding: '2rem' }}>
        <div
          style={{
            padding: '2rem',
            backgroundColor: '#d4edda',
            color: '#155724',
            borderRadius: '8px',
            textAlign: 'center',
          }}
        >
          <h2 style={{ marginTop: 0 }}>✉️ Check your email</h2>
          <p>
            A sign-in link has been sent to <strong>{email}</strong>
          </p>
          <p style={{ marginBottom: 0, fontSize: '0.9rem' }}>
            Click the link in the email to sign in to your account.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '500px', margin: '4rem auto', padding: '2rem' }}>
      <div
        style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <h2 style={{ marginTop: 0, textAlign: 'center' }}>Sign In to Pet Registry</h2>
        <p style={{ textAlign: 'center', color: '#6c757d', marginBottom: '2rem' }}>
          Enter your email to receive a magic link
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              htmlFor="email"
              style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '1rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem',
              fontSize: '1rem',
              fontWeight: 'bold',
              backgroundColor: loading ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Sending...' : '✉️ Send Magic Link'}
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: '#6c757d' }}>
          No password required. We'll email you a secure link to sign in.
        </p>
      </div>

      <p style={{ marginTop: '2rem', textAlign: 'center' }}>
        <a href="/" style={{ color: '#007bff', textDecoration: 'none' }}>
          ← Back to Home
        </a>
      </p>
    </div>
  );
}
