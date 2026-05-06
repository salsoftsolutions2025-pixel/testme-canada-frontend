'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://testme-canada-backend-production.up.railway.app';

function LoginForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const redirect     = searchParams.get('redirect') || '/tests';

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res  = await fetch(`${API}/api/users/login`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Invalid email or password.');
        return;
      }

      // Save token
      localStorage.setItem('token',     data.token);
      localStorage.setItem('userEmail', data.email || email);
      localStorage.setItem('userName',  data.name  || '');

      // If there was a pending purchase, go back to pricing
      const pending = localStorage.getItem('pendingPurchase');
      if (pending) {
        router.push('/pricing');
      } else {
        router.push(redirect);
      }
    } catch {
      setError('Could not connect. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      fontFamily: 'system-ui, sans-serif', minHeight: '100vh',
      background: 'linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
    }}>
      <div style={{
        background: 'white', borderRadius: '20px', padding: '40px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)', maxWidth: '420px', width: '100%'
      }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '4px' }}>🍁</div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: '900', color: '#1E3A5F', margin: 0 }}>
            TestMe Canada
          </h1>
          <p style={{ color: '#6B7280', margin: '4px 0 0', fontSize: '0.9rem' }}>
            Sign in to your account
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: '#FEE2E2', border: '1px solid #FCA5A5',
            borderRadius: '10px', padding: '12px 16px', marginBottom: '20px',
            color: '#B91C1C', fontSize: '0.9rem'
          }}>
            ❌ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="you@email.com"
              style={{
                width: '100%', padding: '12px 14px', borderRadius: '10px',
                border: '2px solid #E5E7EB', fontSize: '1rem', outline: 'none',
                boxSizing: 'border-box', fontFamily: 'inherit',
                transition: 'border-color 0.2s'
              }}
              onFocus={e => e.target.style.borderColor = '#2563EB'}
              onBlur={e  => e.target.style.borderColor = '#E5E7EB'}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              style={{
                width: '100%', padding: '12px 14px', borderRadius: '10px',
                border: '2px solid #E5E7EB', fontSize: '1rem', outline: 'none',
                boxSizing: 'border-box', fontFamily: 'inherit',
                transition: 'border-color 0.2s'
              }}
              onFocus={e => e.target.style.borderColor = '#2563EB'}
              onBlur={e  => e.target.style.borderColor = '#E5E7EB'}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
              background: loading ? '#93C5FD' : '#1E3A5F',
              color: 'white', fontWeight: '800', fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s'
            }}
          >
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0' }}>
          <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }} />
          <span style={{ padding: '0 12px', color: '#9CA3AF', fontSize: '0.85rem' }}>or</span>
          <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }} />
        </div>

        {/* Sign up link */}
        <div style={{ textAlign: 'center' }}>
          {/* FIX: escaped apostrophe to satisfy react/no-unescaped-entities */}
          <p style={{ color: '#6B7280', fontSize: '0.9rem', margin: '0 0 12px' }}>
            Don&apos;t have an account?
          </p>
          <Link href={`/auth/signup?redirect=${encodeURIComponent(redirect)}`} style={{
            display: 'block', padding: '12px', borderRadius: '10px',
            border: '2px solid #1E3A5F', color: '#1E3A5F',
            fontWeight: '700', textDecoration: 'none', fontSize: '0.95rem',
            transition: 'all 0.2s'
          }}>
            Create Account
          </Link>
        </div>

        {/* Back to tests */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link href="/tests" style={{ color: '#9CA3AF', fontSize: '0.85rem', textDecoration: 'none' }}>
            ← Continue without account (5 free questions)
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '60px', color: 'white' }}>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
