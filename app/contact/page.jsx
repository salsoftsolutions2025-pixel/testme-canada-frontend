import Link from 'next/link';

export default function ContactPage() {
  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', minHeight: '100vh', background: '#F8FAFF' }}>
      <div style={{
        background: 'linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%)',
        color: 'white', textAlign: 'center', padding: '60px 20px 40px'
      }}>
        <Link href="/" style={{ color: '#93C5FD', textDecoration: 'none', fontSize: '0.9rem' }}>
          ← Back to Home
        </Link>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', margin: '16px 0 8px' }}>
          Contact Us
        </h1>
        <p style={{ opacity: 0.85, fontSize: '1.1rem' }}>
          We&apos;re here to help!
        </p>
      </div>

      <div style={{ maxWidth: '600px', margin: '60px auto', padding: '0 20px' }}>
        <div style={{ background: 'white', borderRadius: '20px', padding: '40px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>

          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ color: '#1E3A5F', fontSize: '1.3rem', marginBottom: '8px' }}>📧 Email</h2>
            <a href="mailto:salal@salsoftsolutions.ca" style={{ color: '#2563EB', fontSize: '1.1rem', textDecoration: 'none', fontWeight: '600' }}>
              salal@salsoftsolutions.ca
            </a>
            <p style={{ color: '#6B7280', marginTop: '8px', fontSize: '0.9rem' }}>
              We typically respond within 24 hours.
            </p>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ color: '#1E3A5F', fontSize: '1.3rem', marginBottom: '8px' }}>🌐 Website</h2>
            <a href="https://salsoftsolutions.ca" target="_blank" rel="noreferrer"
               style={{ color: '#2563EB', fontSize: '1.1rem', textDecoration: 'none', fontWeight: '600' }}>
              salsoftsolutions.ca
            </a>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ color: '#1E3A5F', fontSize: '1.3rem', marginBottom: '8px' }}>📍 Location</h2>
            <p style={{ color: '#374151', fontSize: '1rem', margin: 0 }}>
              London, Ontario, Canada 🍁
            </p>
          </div>

          <div style={{ background: '#EFF6FF', borderRadius: '12px', padding: '20px' }}>
            <h2 style={{ color: '#1E3A5F', fontSize: '1.1rem', marginBottom: '8px' }}>💬 Common Questions</h2>
            <p style={{ color: '#374151', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
              For billing issues, test access problems, or feedback about the questions — 
              email us and we&apos;ll get back to you as soon as possible!
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Link href="/pricing" style={{
            background: '#1E3A5F', color: 'white', padding: '14px 32px',
            borderRadius: '12px', textDecoration: 'none', fontWeight: '700', fontSize: '1rem'
          }}>
            View Pricing →
          </Link>
        </div>
      </div>
    </main>
  );
}