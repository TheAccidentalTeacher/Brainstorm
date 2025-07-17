'use client';

export default function Home() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center', minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉 IT FUCKING WORKS!</h1>
      <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Ultimate Project Hub is LIVE</p>
      <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '10px', marginBottom: '2rem' }}>
        <h2>✅ Backend: WORKING</h2>
        <h2>✅ Frontend: WORKING</h2>
        <h2>✅ F12 Debug Tools: READY</h2>
      </div>
      <button 
        onClick={() => {
          if (typeof window !== 'undefined') {
            const w = window as any;
            if (w.healthCheck) {
              w.healthCheck();
            } else {
              alert('Debug tools loading...');
            }
          }
        }}
        style={{ 
          background: '#4CAF50', 
          color: 'white', 
          border: 'none', 
          padding: '15px 30px', 
          fontSize: '18px',
          borderRadius: '25px',
          cursor: 'pointer',
          marginRight: '10px'
        }}
      >
        🔍 Test Backend
      </button>
      <a 
        href="/dashboard" 
        style={{ 
          background: '#2196F3', 
          color: 'white', 
          padding: '15px 30px', 
          fontSize: '18px',
          borderRadius: '25px',
          textDecoration: 'none',
          display: 'inline-block'
        }}
      >
        📊 Dashboard
      </a>
      <div style={{ marginTop: '3rem', fontSize: '14px', opacity: 0.8 }}>
        <p>Press F12 and try: healthCheck(), testAPI(), getLogs()</p>
        <p>Backend: Railway | Frontend: Vercel | Built: {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
}
