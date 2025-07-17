'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect immediately to dashboard
    router.push('/dashboard');
  }, [router]);

  // Show minimal loading while redirecting
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      background: '#667eea'
    }}>
      <div style={{ color: 'white', fontSize: '1.2rem' }}>
        Loading Ultimate Project Hub...
      </div>
    </div>
  );
}
