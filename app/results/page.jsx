'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function ResultsContent() {
  const params   = useSearchParams();
  const testSlug = params.get('test')  || 'ontario-g1';
  const score    = parseInt(params.get('score')  || '0');
  const total    = parseInt(params.get('total')  || '5');
  const testName = params.get('name')  || 'Practice Test';

  const percent  = Math.round((score / total) * 100);
  const passed   = percent >= 80;

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', minHeight: '100vh', background: '#F8FAFF' }}>

      {/* Top bar */}
      <div style={{ background: '#1E3A5F', color: 'white', padding: '14px 20px', textAlign: 'center' }}>
        <span style={{ fontWeight: '700' }}>🍁 TestMe Canada</span>
      </div>

      <div style={{ maxWidth: '600px', margin: '40px auto', padding: '0 20px' }}>

        {/* Result banner */}
        <div style={{
          background: passed ? '#DCFCE7' : '#FEE2E2',
          borderRadius: '16px', padding: '36px', textAlign: 'center',
          marginBottom: '24px'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '12px' }}>
            {passed ? '🎉' : '📚'}
          </div>
          <h1 style={{
            fontSize: '2rem', fontWeight: '900', margin: '0 0 8px',
            color: passed ? '#15803D' : '#DC2626'
          }}>
            {passed ? 'Great job!' : 'Keep Practicing!'}
          </h1>
          <p style={{ fontSize: '2.5rem', fontWeight: '900', color: '#111827', margin: '8px 0' }}>
            {score} / {total}
          </p>
          <p style={{ fontSize: '1.3rem', color: '#374151', margin: '0' }}>
            {percent}% correct
          </p>
          <p style={{ color: '#6B7280', marginTop: '8px', fontSize: '0.9rem' }}>
            {testName} — Free Trial
          </p>
        </div>

        {/* Score bar */}
        <div style={{
          background: 'white', borderRadius: '12px', padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: '#374151', fontWeight: '600' }}>Your score</span>
            <span style={{ color: '#374151', fontWeight: '600' }}>{percent}%</span>
          </div>
          <div style={{ background: '#E5E7EB', borderRadius: '8px', height: '12px', overflow: 'hidden' }}>
            <div style={{
              background: passed ? '#16A34A' : '#DC2626',
              height: '100%', width: `${percent}%`, borderRadius: '8px',
              transition: 'width 1s'
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
            <span style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>0%</span>
            <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>Passing: 80%</span>
            <span style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>100%</span>
          </div>
        </div>

        {/* Free trial notice */}
        <div style={{
          background: '#1E3A5F', borderRadius: '16px', padding: '24px',
          textAlign: 'center', color: 'white', marginBottom: '20px'
        }}>
          <p style={{ margin: '0 0 6px', fontWeight: '800', fontSize: '1.1rem' }}>
            🔓 You only practiced {total} free questions
          </p>
          <p style={{ margin: '0 0 20px', opacity: 0.85, fontSize: '0.95rem' }}>
            The full test has 200+ questions. Unlock everything for just $7.99 CAD — one time, lifetime access.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/pricing" style={{
              background: '#F0C040', color: '#1E3A5F',
              padding: '12px 28px', borderRadius: '10px',
              fontWeight: '800', textDecoration: 'none', fontSize: '1rem'
            }}>
              Unlock Full Access — $7.99 →
            </Link>
            <Link href={`/quiz/${testSlug}`} style={{
              background: '#ffffff20', color: 'white',
              padding: '12px 28px', borderRadius: '10px',
              fontWeight: '700', textDecoration: 'none', fontSize: '1rem',
              border: '1px solid #ffffff40'
            }}>
              Try Again (Free)
            </Link>
          </div>
        </div>

        {/* Other tests */}
        <div style={{
          background: 'white', borderRadius: '12px', padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'center'
        }}>
          <p style={{ margin: '0 0 14px', fontWeight: '700', color: '#374151' }}>
            Try another test:
          </p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { slug: 'ontario-g1',  label: '🚗 Ontario G1' },
              { slug: 'citizenship', label: '🍁 Citizenship' },
              { slug: 'food-handler',label: '🍽️ Food Handler' },
            ].filter(t => t.slug !== testSlug).map(t => (
              <Link key={t.slug} href={`/quiz/${t.slug}`} style={{
                background: '#EFF6FF', color: '#2563EB',
                padding: '8px 16px', borderRadius: '8px',
                fontWeight: '600', textDecoration: 'none', fontSize: '0.9rem'
              }}>
                {t.label}
              </Link>
            ))}
          </div>
          <Link href="/tests" style={{
            display: 'block', marginTop: '14px', color: '#6B7280',
            textDecoration: 'none', fontSize: '0.9rem'
          }}>
            ← View all tests
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '60px', fontFamily: 'system-ui' }}>Loading results...</div>}>
      <ResultsContent />
    </Suspense>
  );
}
