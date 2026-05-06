'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://testme-canada-backend-production.up.railway.app';

function SignupForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const redirect     = searchParams.get('redirect') || '/tests';

  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const res  = await fetch(`${API}/api/users/register`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name, email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Could not create account. Email may already be in use.');
        return;
      }

      // Save token
      localStorage.setItem('token',     data.token);
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userName',  name);

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

  const inputStyle = {
    width: '100%', padding: '12px 14px', borderRadius: '10px',
    border: '2px solid #E5E7EB', fontSize: '1rem', outline: 'none',
    boxSizing: 'border-box', fontFamily: 'inherit',
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
            Create Account
          </h1>
          <p style={{ color: '#6B7280', margin: '4px 0 0', fontSize: '0.9rem' }}>
            Get lifetime access to your purchased tests
          </p>
        </div>

        {/* Benefits */}
        <div style={{
          background: '#EFF6FF', borderRadius: '10px', padding: '12px 16px',
          marginBottom: '24px', fontSize: '0.85rem', color: '#1E3A5F'
        }}>
          {['Access purchases from any device', 'Never lose your progress', 'Email receipt for every purchase'].map(b => (
            <div key={b} style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
              <span style={{ color: '#2563EB' }}>✓</span> {b}
            </div>
          ))}
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
        <form onSubmit={handleSignup}>
          {[
            { label: 'Full Name',        value: name,     set: setName,     type: 'text',     ph: 'Your name' },
            { label: 'Email Address',    value: email,    set: setEmail,    type: 'email',    ph: 'you@email.com' },
            { label: 'Password',         value: password, set: setPassword, type: 'password', ph: '••••••••' },
            { label: 'Confirm Password', value: confirm,  set: setConfirm,  type: 'password', ph: '••••••••' },
          ].map(({ label, value, set, type, ph }) => (
            <div key={label} style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                {label}
              </label>
              <input
                type={type}
                value={value}
                onChange={e => set(e.target.value)}
                required
                placeholder={ph}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#2563EB'}
                onBlur={e  => e.target.style.borderColor = '#E5E7EB'}
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
              background: loading ? '#93C5FD' : '#1E3A5F',
              color: 'white', fontWeight: '800', fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer', marginTop: '8px'
            }}
          >
            {loading ? 'Creating account...' : 'Create Account →'}
          </button>
        </form>

        {/* Sign in link */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <p style={{ color: '#6B7280', fontSize: '0.9rem', margin: '0 0 12px' }}>
            Already have an account?
          </p>
          <Link href={`/auth/login?redirect=${encodeURIComponent(redirect)}`} style={{
            display: 'block', padding: '12px', borderRadius: '10px',
            border: '2px solid #1E3A5F', color: '#1E3A5F',
            fontWeight: '700', textDecoration: 'none', fontSize: '0.95rem'
          }}>
            Sign In
          </Link>
        </div>

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Link href="/tests" style={{ color: '#9CA3AF', fontSize: '0.85rem', textDecoration: 'none' }}>
            ← Continue without account (5 free questions)
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '60px' }}>Loading...</div>}>
      <SignupForm />
    </Suspense>
  );
}
