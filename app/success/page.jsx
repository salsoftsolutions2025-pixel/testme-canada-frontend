'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function SuccessContent() {
  const params    = useSearchParams();
  const testSlug  = params.get('test') || '';
  const name      = params.get('name') || 'your test';
  const sessionId = params.get('session_id') || '';

  const [status, setStatus] = useState('loading'); // 'loading' | 'verified' | 'error'
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    if (!sessionId || !testSlug) {
      setErrMsg('Invalid payment link.');
      setStatus('error');
      return;
    }

    // Verify with Stripe via backend before granting access
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    fetch(`${apiUrl}/api/payments/verify/${sessionId}`)
      .then(r => r.json())
      .then(data => {
        if (data.success && data.paid) {
          // ✅ Payment confirmed — now save to localStorage
          const purchases = JSON.parse(localStorage.getItem('purchases') || '[]');
          if (!purchases.includes(testSlug)) {
            purchases.push(testSlug);
            localStorage.setItem('purchases', JSON.stringify(purchases));
          }
          setStatus('verified');
        } else {
          setErrMsg('Payment was not completed. Please try again or contact support.');
          setStatus('error');
        }
      })
      .catch(() => {
        setErrMsg('Could not verify your payment. Please contact support.');
        setStatus('error');
      });
  }, [sessionId, testSlug]);

  // Loading state
  if (status === 'loading') return (
    <div style={{ fontFamily: 'system-ui', minHeight: '100vh', background: '#F8FAFF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⏳</div>
        <p style={{ color: '#374151', fontSize: '1.1rem' }}>Verifying your payment...</p>
      </div>
    </div>
  );

  // Error / fraud attempt state
  if (status === 'error') return (
    <div style={{ fontFamily: 'system-ui', minHeight: '100vh', background: '#F8FAFF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ maxWidth: '500px', width: '100%', textAlign: 'center' }}>
        <div style={{ background: 'white', borderRadius: '20px', padding: '40px',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: '4rem', marginBottom: '16px' }}>❌</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#111827', marginBottom: '12px' }}>
            Payment Verification Failed
          </h1>
          <p style={{ color: '#6B7280', marginBottom: '24px' }}>{errMsg}</p>
          <Link href="/pricing" style={{
            background: '#1E3A5F', color: 'white', padding: '14px 28px',
            borderRadius: '12px', textDecoration: 'none', fontWeight: '700'
          }}>
            Back to Pricing
          </Link>
        </div>
      </div>
    </div>
  );

  // ✅ Verified — show success UI
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', minHeight: '100vh', background: '#F8FAFF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ maxWidth: '500px', width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: '5rem', marginBottom: '16px' }}>🎉</div>
        <div style={{ background: 'white', borderRadius: '20px', padding: '40px',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
          <div style={{ background: '#DCFCE7', borderRadius: '50%', width: '80px', height: '80px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 20px', fontSize: '2.5rem' }}>✅</div>

          <h1 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#111827', marginBottom: '8px' }}>
            Payment Successful!
          </h1>
          <p style={{ color: '#6B7280', marginBottom: '24px', lineHeight: 1.6 }}>
            You now have full access to <strong>{decodeURIComponent(name)}</strong>.
            All questions are unlocked — practice as much as you want!
          </p>

          <div style={{ background: '#EFF6FF', borderRadius: '12px', padding: '16px', marginBottom: '28px' }}>
            <p style={{ margin: 0, color: '#1E3A5F', fontWeight: '600', fontSize: '0.95rem' }}>
              📧 A receipt has been sent to your email
            </p>
            <p style={{ margin: '4px 0 0', color: '#6B7280', fontSize: '0.85rem' }}>
              Your access is lifetime — no expiry
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {testSlug && (
              <Link href={`/quiz/${testSlug}`} style={{
                background: '#1E3A5F', color: 'white', padding: '14px',
                borderRadius: '12px', textDecoration: 'none', fontWeight: '700', fontSize: '1rem'
              }}>
                Start Practicing Now →
              </Link>
            )}
            <Link href="/tests" style={{
              background: '#F3F4F6', color: '#374151', padding: '14px',
              borderRadius: '12px', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem'
            }}>
              View All Tests
            </Link>
          </div>
        </div>
        <p style={{ marginTop: '24px', color: '#9CA3AF', fontSize: '0.85rem' }}>
          Questions? Email <a href="mailto:salal@salsoftsolutions.ca" style={{ color: '#2563EB' }}>
            salal@salsoftsolutions.ca
          </a>
        </p>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '60px' }}>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
