import Link from 'next/link';

const ALL_TESTS = [
  // ── Ontario ────────────────────────────────────────────────
  {
    slug:        'ontario-g1',
    name:        'Ontario G1 Knowledge Test',
    province:    'Ontario',
    category:    'driving',
    icon:        '🚗',
    questions:   200,
    freeQ:       5,
    price:       7.99,
    description: 'Practice for your Ontario G1 driver licence knowledge test — General Rules and Road Signs.',
    color:       '#1E3A5F',
    isG1:        true,
  },
  {
    slug:        'ontario-m1',
    name:        'Ontario M1 Motorcycle Test',
    province:    'Ontario',
    category:    'driving',
    icon:        '🏍️',
    questions:   150,
    freeQ:       5,
    price:       7.99,
    description: 'Prepare for your Ontario M1 motorcycle knowledge test.',
    color:       '#7C3AED',
  },
  {
    slug:        'ontario-az',
    name:        'Ontario AZ Truck Licence',
    province:    'Ontario',
    category:    'driving',
    icon:        '🚛',
    questions:   200,
    freeQ:       5,
    price:       7.99,
    description: 'Study for your Ontario AZ commercial truck licence test.',
    color:       '#B45309',
  },
  // ── British Columbia ────────────────────────────────────────
  {
    slug:        'bc-knowledge',
    name:        'BC ICBC Knowledge Test',
    province:    'British Columbia',
    category:    'driving',
    icon:        '🚗',
    questions:   150,
    freeQ:       5,
    price:       7.99,
    description: 'Practice for the BC ICBC driver knowledge test.',
    color:       '#065F46',
  },
  // ── Alberta ─────────────────────────────────────────────────
  {
    slug:        'alberta-class5',
    name:        'Alberta Class 5 Knowledge',
    province:    'Alberta',
    category:    'driving',
    icon:        '🚗',
    questions:   150,
    freeQ:       5,
    price:       7.99,
    description: 'Prepare for the Alberta Class 5 driver knowledge test.',
    color:       '#92400E',
  },
  // ── Federal / Canada ────────────────────────────────────────
  {
    slug:        'citizenship',
    name:        'Canadian Citizenship Test',
    province:    'Canada',
    category:    'citizenship',
    icon:        '🍁',
    questions:   200,
    freeQ:       5,
    price:       7.99,
    description: 'Study for the Canadian Citizenship knowledge test.',
    color:       '#DC2626',
  },
  {
    slug:        'food-handler',
    name:        'Food Handler Certificate',
    province:    'Canada',
    category:    'professional',
    icon:        '🍽️',
    questions:   150,
    freeQ:       5,
    price:       7.99,
    description: 'Prepare for the Food Handler safety certification test.',
    color:       '#D97706',
  },
  {
    slug:        'whmis',
    name:        'WHMIS 2015 Certification',
    province:    'Canada',
    category:    'professional',
    icon:        '⚠️',
    questions:   100,
    freeQ:       5,
    price:       7.99,
    description: 'Practice WHMIS workplace hazardous materials safety questions.',
    color:       '#DC2626',
  },
];

const CATEGORIES = [
  { key: 'driving',      label: '🚗 Driving Tests',     color: '#1E3A5F' },
  { key: 'citizenship',  label: '🍁 Citizenship',        color: '#DC2626' },
  { key: 'professional', label: '💼 Professional Tests', color: '#065F46' },
];

export default function TestsPage() {
  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', backgroundColor: '#F8FAFF', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%)',
        color: 'white', textAlign: 'center', padding: '60px 20px 40px'
      }}>
        <Link href="/" style={{ color: '#93C5FD', textDecoration: 'none', fontSize: '0.9rem' }}>
          ← Back to Home
        </Link>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', margin: '16px 0 8px' }}>
          Choose Your Test
        </h1>
        <p style={{ opacity: 0.85, fontSize: '1.1rem' }}>
          Try 5 questions free · Full access from $7.99 CAD
        </p>
      </div>

      {/* Tests by category */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px' }}>
        {CATEGORIES.map(cat => {
          const tests = ALL_TESTS.filter(t => t.category === cat.key);
          if (tests.length === 0) return null;
          return (
            <div key={cat.key} style={{ marginBottom: '48px' }}>

              {/* Category heading */}
              <h2 style={{
                fontSize: '1.4rem', fontWeight: '800', color: cat.color,
                borderBottom: `3px solid ${cat.color}`,
                paddingBottom: '8px', marginBottom: '24px'
              }}>
                {cat.label}
              </h2>

              {/* Test cards grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '20px'
              }}>
                {tests.map(test => (
                  <div key={test.slug} style={{
                    background: 'white', borderRadius: '16px', padding: '24px',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                    borderTop: `4px solid ${test.color}`,
                    display: 'flex', flexDirection: 'column', gap: '12px'
                  }}>

                    {/* Icon + province */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '2.5rem' }}>{test.icon}</span>
                      <span style={{
                        background: '#EFF6FF', color: '#2563EB',
                        padding: '4px 12px', borderRadius: '20px',
                        fontSize: '0.8rem', fontWeight: '700'
                      }}>
                        {test.province}
                      </span>
                    </div>

                    {/* Name */}
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#111827', margin: 0 }}>
                      {test.name}
                    </h3>

                    {/* Description */}
                    <p style={{ fontSize: '0.9rem', color: '#6B7280', margin: 0, lineHeight: 1.5 }}>
                      {test.description}
                    </p>

                    {/* Stats */}
                    <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: '#374151' }}>
                      <span>📝 {test.questions}+ questions</span>
                      <span>✅ {test.freeQ} free</span>
                    </div>

                    {/* Price */}
                    <div>
                      <span style={{ fontSize: '1.3rem', fontWeight: '900', color: test.color }}>
                        ${test.price} CAD
                      </span>
                      <span style={{ fontSize: '0.8rem', color: '#9CA3AF', marginLeft: '4px' }}>
                        full access
                      </span>
                    </div>

                    {/* G1 — two part buttons */}
                    {test.isG1 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '4px' }}>
                        <Link href="/quiz/ontario-g1" style={{
                          background: '#1E3A5F', color: 'white',
                          padding: '12px 16px', borderRadius: '10px', textAlign: 'center',
                          fontWeight: '700', textDecoration: 'none', fontSize: '0.95rem',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                        }}>
                          📋 Part 1 — General Rules
                        </Link>
                      <Link href="/quiz/ontario-g1-signs" style={{
                          background: '#DC2626', color: 'white',
                          padding: '12px 16px', borderRadius: '10px', textAlign: 'center',
                          fontWeight: '700', textDecoration: 'none', fontSize: '0.95rem',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                        }}>
                          🛑 Part 2 — Road Signs
                        </Link>
                        <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '10px' }}>
                          <div style={{ fontSize: '0.75rem', color: '#6B7280', marginBottom: '8px', textAlign: 'center' }}>
                            🎁 مجاناً مع شراء G1 — النسخة العربية
                          </div>
                          <Link href="/quiz/ontario-g1-arabic" style={{
                            background: '#065F46', color: 'white',
                            padding: '12px 16px', borderRadius: '10px', textAlign: 'center',
                            fontWeight: '700', textDecoration: 'none', fontSize: '0.95rem',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            direction: 'rtl'
                          }}>
                            📋 الجزء الأول — القواعد العامة
                          </Link>
                          <Link href="/quiz/ontario-g1-signs-arabic" style={{
                            background: '#7C3AED', color: 'white',
                            padding: '12px 16px', borderRadius: '10px', textAlign: 'center',
                            fontWeight: '700', textDecoration: 'none', fontSize: '0.95rem',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            marginTop: '8px', direction: 'rtl'
                          }}>
                            🛑 الجزء الثاني — إشارات الطريق
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <Link href={`/quiz/${test.slug}`} style={{
                        background: test.color, color: 'white',
                        padding: '10px 20px', borderRadius: '10px',
                        fontWeight: '700', fontSize: '0.95rem',
                        textDecoration: 'none', textAlign: 'center', marginTop: '4px'
                      }}>
                        Start Free →
                      </Link>
                    )}

                  </div>
                ))}
              </div>

            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div style={{
        background: '#1E3A5F', color: 'white',
        textAlign: 'center', padding: '40px 20px'
      }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>
          More tests coming soon! 🚀
        </h3>
        <p style={{ opacity: 0.8, marginBottom: '0' }}>
          Quebec · Manitoba · Saskatchewan · Nova Scotia · Air Brakes · Security Guard
        </p>
        <p style={{ opacity: 0.6, marginTop: '16px', fontSize: '0.9rem' }}>
          Developed by SalSoftSolutions.ca — London, Ontario 🍁
        </p>
      </div>

    </main>
  );
}
