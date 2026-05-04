'use client';

import { useState } from 'react';
import Link from 'next/link';

// All available tests with their details
const TESTS = [
  // Driving
  { slug:'ontario-g1',    name:'Ontario G1 Knowledge Test',    icon:'🚗', province:'Ontario',          category:'driving',      price:7.99, questions:200, popular:true  },
  { slug:'ontario-g1-signs',name:'Ontario G1 Road Signs',      icon:'🛑', province:'Ontario',          category:'driving',      price:7.99, questions:62,  popular:false },
  { slug:'ontario-m1',    name:'Ontario M1 Motorcycle Test',   icon:'🏍️', province:'Ontario',          category:'driving',      price:7.99, questions:60,  popular:false },
  { slug:'ontario-az',    name:'Ontario AZ Truck Licence',     icon:'🚛', province:'Ontario',          category:'driving',      price:7.99, questions:60,  popular:false },
  { slug:'bc-knowledge',  name:'BC ICBC Knowledge Test',       icon:'🚗', province:'British Columbia', category:'driving',      price:7.99, questions:40,  popular:false },
  { slug:'alberta-class5',name:'Alberta Class 5 Knowledge',    icon:'🚗', province:'Alberta',          category:'driving',      price:7.99, questions:40,  popular:false },
  // Certification
  { slug:'citizenship',   name:'Canadian Citizenship Test',    icon:'🍁', province:'Canada',           category:'citizenship',  price:7.99, questions:60,  popular:true  },
  { slug:'food-handler',  name:'Food Handler Certificate',     icon:'🍽️', province:'Canada',           category:'professional', price:7.99, questions:50,  popular:false },
  { slug:'whmis',         name:'WHMIS 2015 Certification',     icon:'⚠️', province:'Canada',           category:'professional', price:7.99, questions:50,  popular:false },
];

const BUNDLES = [
  {
    id:       'ontario-bundle',
    name:     'Ontario Complete Bundle',
    icon:     '🍁',
    price:    19.99,
    savings:  35.93,
    tests:    ['ontario-g1','ontario-g1-signs','ontario-m1','ontario-az'],
    color:    '#1E3A5F',
    popular:  true,
    description: 'All 4 Ontario driving tests — G1 Rules, G1 Signs, M1 Motorcycle, and AZ Truck'
  },
  {
    id:       'canada-bundle',
    name:     'Canada Professional Bundle',
    icon:     '🇨🇦',
    price:    14.99,
    savings:  8.98,
    tests:    ['citizenship','food-handler','whmis'],
    color:    '#DC2626',
    popular:  false,
    description: 'Citizenship Test, Food Handler Certificate, and WHMIS 2015 Certification'
  },
  {
    id:       'all-access',
    name:     'All Access Pass',
    icon:     '⭐',
    price:    39.99,
    savings:  31.92,
    tests:    TESTS.map(t => t.slug),
    color:    '#7C3AED',
    popular:  false,
    description: 'Access to ALL 9 tests — every driving test, citizenship, food handler, and WHMIS'
  },
];

const CATEGORY_COLORS = {
  driving:      '#1E3A5F',
  citizenship:  '#DC2626',
  professional: '#065F46',
};

export default function PricingPage() {
  const [activeTab, setActiveTab]   = useState('individual'); // 'individual' | 'bundles'
  const [loading, setLoading]       = useState(null);
  const [category, setCategory]     = useState('all');

  const filtered = category === 'all' ? TESTS : TESTS.filter(t => t.category === category);

  const handlePurchase = async (type, id, price, name) => {
    setLoading(id);
    try {
      const res = await fetch('https://testme-canada-backend-production.up.railway.app/api/payments/create-checkout', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testSlug:  id,
          userId:    1,
          userEmail: 'guest@testmecanada.ca',
          itemName:  name,
          price:     price,
          type:      type,
        }),
      });
      const data = await res.json();
      if (data.checkoutUrl) {
        window.open(data.checkoutUrl, '_self');
      } else {
        alert('Payment setup failed. Please try again.');
      }
    } catch {
      // Backend not connected yet — show demo message
      alert('Payment coming soon! The backend is being set up. Try a free quiz in the meantime.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', minHeight: '100vh', background: '#F8FAFF' }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%)',
        color: 'white', textAlign: 'center', padding: '60px 20px 40px'
      }}>
        <Link href="/" style={{ color: '#93C5FD', textDecoration: 'none', fontSize: '0.9rem' }}>
          ← Back to Home
        </Link>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', margin: '16px 0 8px' }}>
          Simple Pricing
        </h1>
        <p style={{ opacity: 0.85, fontSize: '1.1rem', marginBottom: '8px' }}>
          Try 5 questions free · Unlock full access for just $7.99 CAD
        </p>
        <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>
          One-time payment · Lifetime access · No subscription
        </p>

        {/* Tab switcher */}
        <div style={{
          display: 'inline-flex', background: '#ffffff20', borderRadius: '12px',
          padding: '4px', marginTop: '24px', gap: '4px'
        }}>
          {['individual', 'bundles'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: '10px 24px', borderRadius: '8px', border: 'none',
              cursor: 'pointer', fontWeight: '700', fontSize: '0.95rem',
              background: activeTab === tab ? 'white' : 'transparent',
              color:      activeTab === tab ? '#1E3A5F' : 'white',
              transition: 'all 0.2s'
            }}>
              {tab === 'individual' ? '📝 Individual Tests' : '📦 Bundle Deals'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px 60px' }}>

        {/* ── INDIVIDUAL TESTS ── */}
        {activeTab === 'individual' && (
          <>
            {/* Free vs Paid comparison */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr',
              gap: '16px', marginBottom: '40px'
            }}>
              {/* Free */}
              <div style={{
                background: 'white', borderRadius: '16px', padding: '28px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '2px solid #E5E7EB'
              }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '4px', color: '#374151' }}>Free Trial</h3>
                <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#111827', marginBottom: '20px' }}>$0</div>
                {['5 sample questions per test','Basic score feedback','All tests available','No account needed'].map(f => (
                  <div key={f} style={{ display: 'flex', gap: '8px', marginBottom: '10px', color: '#6B7280', fontSize: '0.95rem' }}>
                    <span style={{ color: '#16A34A' }}>✓</span> {f}
                  </div>
                ))}
                <Link href="/tests" style={{
                  display: 'block', marginTop: '20px', padding: '12px',
                  borderRadius: '8px', textAlign: 'center', textDecoration: 'none',
                  background: '#F3F4F6', color: '#374151', fontWeight: '700'
                }}>
                  Try Free →
                </Link>
              </div>

              {/* Full Access */}
              <div style={{
                background: '#1E3A5F', borderRadius: '16px', padding: '28px',
                boxShadow: '0 4px 20px rgba(30,58,95,0.3)', border: '2px solid #1E3A5F',
                color: 'white'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: '700' }}>Full Access</h3>
                  <span style={{ background: '#F0C040', color: '#1E3A5F', padding: '2px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '700' }}>BEST VALUE</span>
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '4px' }}>$7.99</div>
                <div style={{ opacity: 0.7, fontSize: '0.85rem', marginBottom: '20px' }}>CAD · one time per test · lifetime access</div>
                {['200+ questions per test','Unlimited practice attempts','Progress tracking & history','Weak spots analysis','Exam simulation mode','Instant explanations for every answer'].map(f => (
                  <div key={f} style={{ display: 'flex', gap: '8px', marginBottom: '10px', fontSize: '0.95rem', opacity: 0.9 }}>
                    <span style={{ color: '#F0C040' }}>✓</span> {f}
                  </div>
                ))}
              </div>
            </div>

            {/* Category filter */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
              {[
                { key: 'all',          label: 'All Tests' },
                { key: 'driving',      label: '🚗 Driving' },
                { key: 'citizenship',  label: '🍁 Citizenship' },
                { key: 'professional', label: '💼 Professional' },
              ].map(cat => (
                <button key={cat.key} onClick={() => setCategory(cat.key)} style={{
                  padding: '8px 16px', borderRadius: '20px', border: '2px solid',
                  cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem',
                  borderColor: category === cat.key ? '#2563EB' : '#E5E7EB',
                  background:  category === cat.key ? '#EFF6FF' : 'white',
                  color:       category === cat.key ? '#2563EB' : '#6B7280',
                }}>
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Test cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '16px'
            }}>
              {filtered.map(test => (
                <div key={test.slug} style={{
                  background: 'white', borderRadius: '16px', padding: '24px',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                  borderTop: `4px solid ${CATEGORY_COLORS[test.category]}`,
                  position: 'relative'
                }}>
                  {test.popular && (
                    <span style={{
                      position: 'absolute', top: '16px', right: '16px',
                      background: '#F0C040', color: '#1E3A5F',
                      padding: '2px 10px', borderRadius: '20px',
                      fontSize: '0.75rem', fontWeight: '700'
                    }}>
                      POPULAR
                    </span>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '2rem' }}>{test.icon}</span>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: CATEGORY_COLORS[test.category], fontWeight: '700', textTransform: 'uppercase' }}>
                        {test.province}
                      </div>
                      <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#111827', margin: 0 }}>
                        {test.name}
                      </h3>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: '#6B7280', marginBottom: '16px' }}>
                    <span>📝 {test.questions}+ questions</span>
                    <span>✅ 5 free</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '1.4rem', fontWeight: '900', color: CATEGORY_COLORS[test.category] }}>
                        ${test.price}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: '#9CA3AF', marginLeft: '4px' }}>CAD</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Link href={`/quiz/${test.slug}`} style={{
                        padding: '8px 14px', borderRadius: '8px',
                        border: `2px solid ${CATEGORY_COLORS[test.category]}`,
                        color: CATEGORY_COLORS[test.category], fontWeight: '600',
                        textDecoration: 'none', fontSize: '0.85rem'
                      }}>
                        Try Free
                      </Link>
                      <button
                        onClick={() => handlePurchase('test', test.slug, test.price, test.name)}
                        disabled={loading === test.slug}
                        style={{
                          padding: '8px 16px', borderRadius: '8px', border: 'none',
                          cursor: loading === test.slug ? 'not-allowed' : 'pointer',
                          background: CATEGORY_COLORS[test.category],
                          color: 'white', fontWeight: '700', fontSize: '0.85rem'
                        }}
                      >
                        {loading === test.slug ? '...' : 'Unlock →'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── BUNDLE DEALS ── */}
        {activeTab === 'bundles' && (
          <>
            <p style={{ textAlign: 'center', color: '#6B7280', marginBottom: '32px', fontSize: '1.05rem' }}>
              Save more by bundling multiple tests together
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
              {BUNDLES.map(bundle => (
                <div key={bundle.id} style={{
                  background: 'white', borderRadius: '20px', padding: '32px',
                  boxShadow: bundle.popular ? '0 8px 32px rgba(30,58,95,0.15)' : '0 2px 12px rgba(0,0,0,0.06)',
                  border: bundle.popular ? `2px solid ${bundle.color}` : '2px solid #E5E7EB',
                  position: 'relative'
                }}>
                  {bundle.popular && (
                    <div style={{
                      position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)',
                      background: bundle.color, color: 'white', padding: '4px 20px',
                      borderRadius: '20px', fontSize: '0.8rem', fontWeight: '700', whiteSpace: 'nowrap'
                    }}>
                      ⭐ MOST POPULAR
                    </div>
                  )}

                  <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <span style={{ fontSize: '3rem' }}>{bundle.icon}</span>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#111827', margin: '8px 0 4px' }}>
                      {bundle.name}
                    </h3>
                    <p style={{ color: '#6B7280', fontSize: '0.9rem', margin: 0 }}>
                      {bundle.description}
                    </p>
                  </div>

                  {/* Price */}
                  <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <div style={{ fontSize: '3rem', fontWeight: '900', color: bundle.color }}>
                      ${bundle.price}
                    </div>
                    <div style={{ color: '#9CA3AF', fontSize: '0.85rem' }}>CAD · one time · lifetime access</div>
                    <div style={{
                      display: 'inline-block', marginTop: '8px',
                      background: '#DCFCE7', color: '#15803D',
                      padding: '4px 14px', borderRadius: '20px',
                      fontSize: '0.85rem', fontWeight: '700'
                    }}>
                      Save ${bundle.savings.toFixed(2)} vs individual
                    </div>
                  </div>

                  {/* Included tests */}
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#374151', marginBottom: '8px' }}>
                      Includes:
                    </div>
                    {bundle.tests.map(slug => {
                      const test = TESTS.find(t => t.slug === slug);
                      if (!test) return null;
                      return (
                        <div key={slug} style={{
                          display: 'flex', alignItems: 'center', gap: '8px',
                          padding: '6px 0', borderBottom: '1px solid #F3F4F6',
                          fontSize: '0.9rem', color: '#374151'
                        }}>
                          <span>{test.icon}</span>
                          <span>{test.name}</span>
                          <span style={{ marginLeft: 'auto', color: '#9CA3AF', fontSize: '0.8rem' }}>
                            {test.questions}+ q
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handlePurchase('bundle', bundle.id, bundle.price, bundle.name)}
                    disabled={loading === bundle.id}
                    style={{
                      width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
                      cursor: loading === bundle.id ? 'not-allowed' : 'pointer',
                      background: bundle.color, color: 'white',
                      fontWeight: '800', fontSize: '1rem'
                    }}
                  >
                    {loading === bundle.id ? 'Loading...' : `Get ${bundle.name} — $${bundle.price} CAD →`}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* FAQ Section */}
        <div style={{ marginTop: '60px' }}>
          <h2 style={{ textAlign: 'center', fontSize: '1.8rem', color: '#1E3A5F', marginBottom: '32px', fontWeight: '800' }}>
            Frequently Asked Questions
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {[
              { q: 'How long does access last?', a: 'Lifetime! Once you purchase, you have access forever. No expiry, no subscription.' },
              { q: 'What payment methods are accepted?', a: 'We accept all major credit and debit cards (Visa, Mastercard, Amex) via Stripe — Canada\'s most trusted payment processor.' },
              { q: 'Can I try before buying?', a: 'Yes! Every test has 5 free questions so you can experience the format before purchasing.' },
              { q: 'Is my payment secure?', a: 'All payments are processed by Stripe — the same technology used by Amazon and Shopify. We never store your card details.' },
              { q: 'Do I need an account?', a: 'No account needed for free questions. An account lets you track your progress across sessions.' },
              { q: 'What if I have questions?', a: 'Email us at salal@salsoftsolutions.ca — we typically respond within 24 hours.' },
            ].map(faq => (
              <div key={faq.q} style={{
                background: 'white', borderRadius: '12px', padding: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
              }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#1E3A5F', marginBottom: '8px' }}>
                  {faq.q}
                </h4>
                <p style={{ fontSize: '0.9rem', color: '#6B7280', margin: 0, lineHeight: 1.6 }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Money back */}
        <div style={{
          marginTop: '40px', background: '#1E3A5F', borderRadius: '16px',
          padding: '32px', textAlign: 'center', color: 'white'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🍁</div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '8px' }}>
            Made in Canada · Trusted by thousands of new drivers
          </h3>
          <p style={{ opacity: 0.8, marginBottom: '0', fontSize: '0.95rem' }}>
            Developed by SalSoftSolutions.ca · London, Ontario, Canada
          </p>
        </div>

      </div>
    </div>
  );
}
