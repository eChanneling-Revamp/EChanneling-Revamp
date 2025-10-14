import React from 'react';
import { colors, borderRadius, shadows } from '@/styles/design-system';

export interface CardProps {
  children: React.ReactNode;
  padding?: 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({
  children,
  padding = 'md',
  shadow = 'md',
  className = '',
  style = {},
}) => {
  const paddingMap = {
    sm: '1rem',
    md: '1.5rem', 
    lg: '2rem',
  };

  const shadowMap = {
    none: 'none',
    sm: shadows.sm,
    md: shadows.md,
    lg: shadows.lg,
  };

  const cardStyles: React.CSSProperties = {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.xl,
    boxShadow: shadowMap[shadow],
    border: `1px solid ${colors.border.light}`,
    padding: paddingMap[padding],
    ...style,
  };

  return (
    <div style={cardStyles} className={className}>
      {children}
    </div>
  );
};
