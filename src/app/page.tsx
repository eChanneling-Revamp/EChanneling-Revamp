'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { colors } from '@/styles/design-system';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Always redirect to login when visiting the main page
    router.push('/login');
  }, [router]);

  // Show loading while redirecting
  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background.secondary,
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: `3px solid ${colors.primary[200]}`,
          borderTop: `3px solid ${colors.primary[500]}`,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }} />
        <p style={{
          color: colors.text.secondary,
          fontSize: '0.875rem',
        }}>
          Redirecting to login...
        </p>
      </div>
    </div>
  );
}
