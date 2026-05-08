import Link from 'next/link';

type TestCard = {
  slug: string;
  name: string;
  icon: string;
  province: string;
  isG1?: boolean;
  isG1Arabic?: boolean;
  isAlberta?: boolean;
  isAlbertaArabic?: boolean;
};

export default function HomePage() {
  const tests: TestCard[] = [
    // Ontario G1 — special card with two buttons
    { slug: 'ontario-g1',       name: 'Ontario G1 Knowledge Test',    icon: '🚗', province: 'Ontario', isG1: true },
    { slug: 'ontario-g1-arabic', name: 'اختبار G1 أونتاريو — عربي', icon: '🚗', province: 'Ontario', isG1Arabic: true },
    // Other tests — single button each
    { slug: 'ontario-m1',    name: 'Ontario M1 Motorcycle',     icon: '🏍️', province: 'Ontario' },
    { slug: 'bc-knowledge',  name: 'BC ICBC Knowledge Test',    icon: '🚗', province: 'BC' },
    { slug: 'alberta-class5', name: 'Alberta Class 7 Knowledge Test', icon: '🚗', province: 'Alberta', isAlberta: true },
    { slug: 'alberta-class5-arabic', name: 'اختبار الصنف 7 في ألبرتا — عربي', icon: '🚗', province: 'Alberta', isAlbertaArabic: true },
    { slug: 'citizenship',   name: 'Citizenship Test',          icon: '🍁', province: 'Canada' },
    { slug: 'food-handler',  name: 'Food Handler',              icon: '🍽️', province: 'Canada' },
    { slug: 'ontario-az',    name: 'AZ Truck Licence',          icon: '🚛', province: 'Ontario' },
    { slug: 'whmis', name: 'WHMIS 2015 Certification', icon: '⚠️', province: 'Canada' },
  ];

  // Province badge colors
  const provinceColors = {
    Ontario: '#2563EB',
    BC:      '#065F46',
    Alberta: '#92400E',
    Canada:  '#DC2626',
  };

  return (
    <main>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%)',
        color: 'white', textAlign: 'center', padding: '80px 20px'
      }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '16px' }}>
          🍁 TestMe Canada
        </h1>
        <p style={{ fontSize: '1.3rem', opacity: 0.9, marginBottom: '32px' }}>
          Canada&apos;s #1 test preparation platform
        </p>
        <p style={{ fontSize: '1.1rem', opacity: 0.8, marginBottom: '40px' }}>
          G1 · M1 · AZ · BC · Alberta · Citizenship · Food Handler · WHMIS
        </p>
        <Link href="/tests" style={{
          backgroundColor: '#F0C040', color: '#1E3A5F',
          padding: '16px 40px', borderRadius: '50px',
          fontWeight: '800', fontSize: '1.1rem', textDecoration: 'none'
        }}>
          Start Practicing FREE →
        </Link>
      </section>

      {/* Stats Bar */}
      <section style={{ background: '#F8FAFF', padding: '40px 20px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '60px', flexWrap: 'wrap' }}>
          {[
            { number: '10+',   label: 'Province Tests' },
            { number: '2000+', label: 'Practice Questions' },
            { number: '62',    label: 'Road Signs' },
            { number: '$7.99', label: 'Full Access' },
          ].map(stat => (
            <div key={stat.label}>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1E3A5F' }}>
                {stat.number}
              </div>
              <div style={{ color: '#6B7280' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Test Cards Grid */}
      <section style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '40px', color: '#1E3A5F' }}>
          Choose Your Test
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          {tests.map(test => (
            <div key={test.slug} style={{
              background: 'white', borderRadius: '16px', padding: '28px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              border: '2px solid #E5E7EB',
            }}>
              {/* Icon + province badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span style={{ fontSize: '3rem' }}>{test.icon}</span>
                <span style={{
                 background: `${provinceColors[test.province as keyof typeof provinceColors] ?? '#2563EB'}18`,
                color: provinceColors[test.province as keyof typeof provinceColors] ?? '#2563EB',
                  padding: '4px 12px', borderRadius: '20px',
                  fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase'
                }}>
                  {test.province}
                </span>
              </div>

              <h3 style={{ fontSize: '1.2rem', color: '#111827', marginBottom: '8px', fontWeight: '700' }}>
                {test.name}
              </h3>

              <div style={{ color: '#16A34A', fontWeight: '600', marginBottom: '16px' }}>
                ✅ 5 free questions
              </div>

              {/* Ontario G1 — two part buttons */}
             {test.isG1 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <Link href="/quiz/ontario-g1" style={{
                    background: '#1E3A5F', color: 'white',
                    padding: '11px 16px', borderRadius: '8px', textAlign: 'center',
                    fontWeight: '700', textDecoration: 'none', fontSize: '0.9rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                  }}>
                    📋 Part 1 — General Rules
                  </Link>
                  <Link href="/quiz/ontario-g1-signs" style={{
                    background: '#DC2626', color: 'white',
                    padding: '11px 16px', borderRadius: '8px', textAlign: 'center',
                    fontWeight: '700', textDecoration: 'none', fontSize: '0.9rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                  }}>
                    🛑 Part 2 — Road Signs
                  </Link>
                </div>
                ) : test.isAlberta ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '4px' }}>
                <Link href="/quiz/alberta-class5" style={{
                 background: '#92400E', color: 'white',
                 padding: '12px 16px', borderRadius: '10px', textAlign: 'center',
                fontWeight: '700', textDecoration: 'none', fontSize: '0.95rem',
                 display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                }}>
               📋 Part 1 — General Rules
               </Link>
    <Link href="/quiz/alberta-class5-signs" style={{
      background: '#B45309', color: 'white',
      padding: '12px 16px', borderRadius: '10px', textAlign: 'center',
      fontWeight: '700', textDecoration: 'none', fontSize: '0.95rem',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
    }}>
      🛑 Part 2 — Road Signs
    </Link>
  </div> 

                ) : test.isAlberta ? (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
    <Link href="/quiz/alberta-class5" style={{
      background: '#92400E', color: 'white',
      padding: '11px 16px', borderRadius: '8px', textAlign: 'center',
      fontWeight: '700', textDecoration: 'none', fontSize: '0.9rem',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
    }}>
      📋 Part 1 — General Rules
    </Link>
    <Link href="/quiz/alberta-class5-signs" style={{
      background: '#B45309', color: 'white',
      padding: '11px 16px', borderRadius: '8px', textAlign: 'center',
      fontWeight: '700', textDecoration: 'none', fontSize: '0.9rem',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
    }}>
      🛑 Part 2 — Road Signs
    </Link>
  </div>

) : test.isAlbertaArabic ? (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '4px', direction: 'rtl' }}>
    <Link href="/quiz/alberta-class5-arabic" style={{
      background: '#92400E', color: 'white',
      padding: '12px 16px', borderRadius: '10px', textAlign: 'center',
      fontWeight: '700', textDecoration: 'none', fontSize: '0.95rem',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
    }}>
      📋 الجزء الأول — القواعد العامة
    </Link>
    <Link href="/quiz/alberta-class5-signs-arabic" style={{
      background: '#B45309', color: 'white',
      padding: '12px 16px', borderRadius: '10px', textAlign: 'center',
      fontWeight: '700', textDecoration: 'none', fontSize: '0.95rem',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
    }}>
      🛑 الجزء الثاني — إشارات الطريق
    </Link>
  </div>



              ) : test.isG1Arabic ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', direction: 'rtl' }}>
                  <Link href="/quiz/ontario-g1-arabic" style={{
                    background: '#1E3A5F', color: 'white',
                    padding: '11px 16px', borderRadius: '8px', textAlign: 'center',
                    fontWeight: '700', textDecoration: 'none', fontSize: '0.9rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                  }}>
                    📋 الجزء الأول — القواعد العامة
                  </Link>
                  <Link href="/quiz/ontario-g1-signs-arabic" style={{
                    background: '#DC2626', color: 'white',
                    padding: '11px 16px', borderRadius: '8px', textAlign: 'center',
                    fontWeight: '700', textDecoration: 'none', fontSize: '0.9rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                  }}>
                    🛑 الجزء الثاني — إشارات الطريق
                  </Link>
                </div>
              ) : (
                <Link href={`/quiz/${test.slug}`} style={{
                  display: 'block',
                 background: provinceColors[test.province as keyof typeof provinceColors] || '#2563EB',
                  color: 'white', padding: '11px 16px', borderRadius: '8px',
                  textAlign: 'center', fontWeight: '700', textDecoration: 'none',
                  fontSize: '0.95rem'
                }}>
                  Start Free →
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section style={{ background: '#1E3A5F', color: 'white', padding: '60px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>Simple Pricing</h2>
        <p style={{ opacity: 0.8, marginBottom: '40px' }}>
          Try 5 questions free — unlock full access for just $7.99 CAD
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
          <div style={{ background: '#ffffff15', borderRadius: '16px', padding: '32px',
                        width: '280px', border: '1px solid #ffffff30' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Free</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '24px' }}>$0</div>
            {['5 sample questions', 'Basic score feedback', 'All tests available', 'No account needed'].map(f => (
              <div key={f} style={{ marginBottom: '12px', opacity: 0.9 }}>✓ {f}</div>
            ))}
          </div>
          <div style={{ background: '#F0C040', borderRadius: '16px', padding: '32px',
                        width: '280px', color: '#1E3A5F' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Full Access</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '4px' }}>$7.99</div>
            <div style={{ marginBottom: '24px', fontSize: '0.9rem' }}>CAD — one time per test</div>
            {['200+ questions', 'Unlimited attempts', 'Progress tracking',
              'Weak spots analysis', 'Exam simulation', 'Lifetime access'].map(f => (
              <div key={f} style={{ marginBottom: '12px', fontWeight: '600' }}>✓ {f}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#111827', color: '#9CA3AF', padding: '40px 20px', textAlign: 'center' }}>
        <p style={{ fontSize: '1.1rem', color: 'white', marginBottom: '8px' }}>🍁 TestMe Canada</p>
        <p>Developed by <a href="https://salsoftsolutions.ca" style={{ color: '#F0C040' }}>SalSoftSolutions.ca</a></p>
        <p style={{ marginTop: '8px' }}>
          <a href="/privacy" style={{ color: '#6B7280', marginRight: '16px' }}>Privacy Policy</a>
          <a href="/terms"   style={{ color: '#6B7280', marginRight: '16px' }}>Terms of Use</a>
          <a href="/contact" style={{ color: '#6B7280' }}>Contact</a>
        </p>
        <p style={{ marginTop: '16px' }}>© 2026 SalSoftSolutions. All rights reserved.</p>
      </footer>
    </main>
  );
}
