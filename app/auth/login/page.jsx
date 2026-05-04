'use client';
import Link from 'next/link';
export default function LoginPage() {
  return (
    <div style={{ fontFamily:'system-ui', minHeight:'100vh', background:'#F8FAFF',
                  display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
      <div style={{ background:'white', borderRadius:'16px', padding:'40px',
                    boxShadow:'0 4px 20px rgba(0,0,0,0.08)', maxWidth:'420px', width:'100%', textAlign:'center' }}>
        <div style={{ fontSize:'2rem', fontWeight:'900', color:'#1E3A5F', marginBottom:'8px' }}>🍁 TestMe Canada</div>
        <h2 style={{ color:'#374151', marginBottom:'24px' }}>Sign In</h2>
        <p style={{ color:'#6B7280', marginBottom:'24px' }}>Login coming soon!</p>
        <Link href="/tests" style={{ display:'block', padding:'14px', borderRadius:'10px',
          background:'#1E3A5F', color:'white', fontWeight:'700', textDecoration:'none' }}>
          Try Free Questions →
        </Link>
        <Link href="/auth/signup" style={{ display:'block', marginTop:'12px', color:'#6B7280', fontSize:'0.9rem' }}>
          Create an account
        </Link>
      </div>
    </div>
  );
}