'use client';

import React from 'react';
import Image from 'next/image';
import { LoginForm } from './LoginForm';
import { colors } from '@/styles/design-system';

interface LoginLayoutProps {
  onLoginSuccess?: () => void;
}

export const LoginLayout: React.FC<LoginLayoutProps> = ({ onLoginSuccess }) => {
  const containerStyles: React.CSSProperties = {
    minHeight: '100vh',
    display: 'flex',
    backgroundColor: colors.background.secondary,
  };

  const leftPanelStyles: React.CSSProperties = {
    flex: 1,
    background: `linear-gradient(135deg, ${colors.primary[600]} 0%, ${colors.primary[500]} 50%, ${colors.secondary[500]} 100%)`,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
    position: 'relative',
    overflow: 'hidden',
  };

  const rightPanelStyles: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
  };

  const brandingStyles: React.CSSProperties = {
    textAlign: 'center',
    color: colors.text.inverse,
    zIndex: 2,
  };

  const logoContainerStyles: React.CSSProperties = {
    marginBottom: '2rem',
    padding: '1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '1rem',
    backdropFilter: 'blur(10px)',
  };

  const titleStyles: React.CSSProperties = {
    fontSize: '3rem',
    fontWeight: '700',
    marginBottom: '1rem',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  };

  const subtitleStyles: React.CSSProperties = {
    fontSize: '1.25rem',
    fontWeight: '400',
    opacity: 0.9,
    maxWidth: '400px',
    lineHeight: 1.6,
  };

  const decorativeCircleStyles: React.CSSProperties = {
    position: 'absolute',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.1)',
    animation: 'float 6s ease-in-out infinite',
  };

  const formContainerStyles: React.CSSProperties = {
    width: '100%',
    maxWidth: '400px',
  };

  return (
    <>
      {/* Add keyframe animation styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          .container {
            flex-direction: column;
          }
          
          .left-panel {
            flex: none;
            min-height: 40vh;
          }
          
          .right-panel {
            flex: none;
            min-height: 60vh;
          }
          
          .title {
            font-size: 2rem !important;
          }
          
          .subtitle {
            font-size: 1rem !important;
          }
        }
      `}</style>

      <div style={containerStyles} className="container">
        {/* Left Panel - Branding */}
        <div style={leftPanelStyles} className="left-panel">
          {/* Decorative Elements */}
          <div style={{
            ...decorativeCircleStyles,
            width: '200px',
            height: '200px',
            top: '10%',
            left: '10%',
            animationDelay: '0s',
          }} />
          <div style={{
            ...decorativeCircleStyles,
            width: '150px',
            height: '150px',
            bottom: '15%',
            right: '15%',
            animationDelay: '2s',
          }} />
          <div style={{
            ...decorativeCircleStyles,
            width: '100px',
            height: '100px',
            top: '60%',
            left: '5%',
            animationDelay: '4s',
          }} />

          <div style={brandingStyles}>
            <div style={logoContainerStyles}>
              <Image
                src="/images/logo/Logo.png"
                alt="EChanneling Logo"
                width={120}
                height={120}
                style={{
                  objectFit: 'contain',
                  filter: 'brightness(0) invert(1)',
                }}
                priority
              />
            </div>
            
            <h1 style={titleStyles} className="title">
              EChanneling
            </h1>
            
            <p style={subtitleStyles} className="subtitle">
              Your trusted healthcare partner. Access quality medical care with ease and convenience.
            </p>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div style={rightPanelStyles} className="right-panel">
          <div style={formContainerStyles}>
            <LoginForm 
              onSuccess={onLoginSuccess}
              showGoogleLogin={true}
            />
          </div>
        </div>
      </div>
    </>
  );
};
