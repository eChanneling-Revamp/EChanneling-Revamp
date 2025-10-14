'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { colors } from '@/styles/design-system';
import { MenuIcon, BellIcon, ChevronDownIcon } from '@/components/icons/dashboard';

interface HeaderProps {
  onToggleSidebar: () => void;
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, title = 'Dashboard' }) => {
  const { data: session } = useSession();

  const headerStyles: React.CSSProperties = {
    height: '80px',
    backgroundColor: colors.background.primary,
    borderBottom: `1px solid ${colors.border.light}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 1.5rem',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  };

  const leftSectionStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  };

  const rightSectionStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  };

  const titleStyles: React.CSSProperties = {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: colors.text.primary,
    margin: 0,
  };

  const iconButtonStyles: React.CSSProperties = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0.5rem',
    borderRadius: '0.375rem',
    color: colors.text.secondary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  };

  const notificationButtonStyles: React.CSSProperties = {
    ...iconButtonStyles,
    position: 'relative',
  };

  const userMenuStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.5rem',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: `1px solid ${colors.border.light}`,
  };

  const avatarStyles: React.CSSProperties = {
    width: '40px',
    height: '40px',
    backgroundColor: colors.primary[100],
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: colors.primary[600],
    fontWeight: '600',
    fontSize: '1rem',
  };

  const breadcrumbStyles: React.CSSProperties = {
    fontSize: '0.875rem',
    color: colors.text.secondary,
    margin: 0,
  };

  return (
    <header style={headerStyles}>
      <div style={leftSectionStyles}>
        <button
          style={iconButtonStyles}
          onClick={onToggleSidebar}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.neutral[100];
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <MenuIcon size={20} />
        </button>
        
        <div>
          <h1 style={titleStyles}>{title}</h1>
          <p style={breadcrumbStyles}>
            Admin Dashboard / {title}
          </p>
        </div>
      </div>

      <div style={rightSectionStyles}>
        {/* Search Bar - Hidden on mobile */}
        <div style={{ position: 'relative' }} className="hidden md:block">
          <input
            type="text"
            placeholder="Search..."
            style={{
              width: '300px',
              padding: '0.5rem 1rem',
              border: `1px solid ${colors.border.medium}`,
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              backgroundColor: colors.background.secondary,
              outline: 'none',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = colors.primary[500];
              e.target.style.backgroundColor = colors.background.primary;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = colors.border.medium;
              e.target.style.backgroundColor = colors.background.secondary;
            }}
          />
        </div>

        {/* Notifications */}
        <button
          style={notificationButtonStyles}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.neutral[100];
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <BellIcon size={20} />
          {/* Notification Badge */}
          <span
            style={{
              position: 'absolute',
              top: '0.25rem',
              right: '0.25rem',
              width: '8px',
              height: '8px',
              backgroundColor: colors.error,
              borderRadius: '50%',
            }}
          />
        </button>

        {/* User Menu */}
        <div
          style={userMenuStyles}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.neutral[50];
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <div style={avatarStyles}>
            {session?.user?.name?.charAt(0) || 'A'}
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{ 
              fontSize: '0.875rem', 
              fontWeight: '500', 
              color: colors.text.primary 
            }}>
              {session?.user?.name || 'Administrator'}
            </span>
            <span style={{ 
              fontSize: '0.75rem', 
              color: colors.text.secondary 
            }}>
              {session?.user?.email}
            </span>
          </div>
          
          <ChevronDownIcon size={16} color={colors.text.secondary} />
        </div>
      </div>
    </header>
  );
};
