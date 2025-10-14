'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { colors } from '@/styles/design-system';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Still loading

    if (!session) {
      router.push('/login');
      return;
    }

    // Redirect based on user role
    const userRole = (session.user as any)?.role;
    
    switch (userRole) {
      case 'ADMIN':
        router.push('/admin/dashboard');
        break;
      case 'DOCTOR':
        router.push('/doctor/dashboard');
        break;
      case 'HOSPITAL':
        router.push('/hospital/dashboard');
        break;
      case 'USER':
      default:
        router.push('/user/dashboard');
        break;
    }
  }, [session, status, router]);

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
          Redirecting to your dashboard...
        </p>
      </div>
    </div>
  );
}
