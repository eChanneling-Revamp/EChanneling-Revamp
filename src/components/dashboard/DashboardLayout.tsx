'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { colors } from '@/styles/design-system';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  title = 'Dashboard' 
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Still loading
    
    if (!session) {
      router.push('/login');
      return;
    }

    // Check if user has admin role
    if (session.user && (session.user as any).role !== 'ADMIN') {
      router.push('/login?error=access_denied');
      return;
    }
  }, [session, status, router]);

  // Show loading while checking authentication
  if (status === 'loading') {
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
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated or not admin
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return null;
  }

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const layoutStyles: React.CSSProperties = {
    display: 'flex',
    height: '100vh',
    backgroundColor: colors.background.secondary,
  };

  const mainContentStyles: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    marginLeft: sidebarCollapsed ? '80px' : '280px',
    transition: 'margin-left 0.3s ease',
    minWidth: 0, // Prevents flex item from overflowing
  };

  const contentAreaStyles: React.CSSProperties = {
    flex: 1,
    padding: '1.5rem',
    overflowY: 'auto',
    overflowX: 'hidden',
  };

  return (
    <div style={layoutStyles}>
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={handleToggleSidebar} 
      />
      
      <div style={mainContentStyles}>
        <Header 
          onToggleSidebar={handleToggleSidebar} 
          title={title} 
        />
        
        <main style={contentAreaStyles}>
          {children}
        </main>
      </div>
    </div>
  );
};
