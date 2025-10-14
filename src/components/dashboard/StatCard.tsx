'use client';

import React from 'react';
import { Card } from '@/components/ui';
import { colors } from '@/styles/design-system';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    type: 'increase' | 'decrease' | 'neutral';
  };
  icon: React.ReactNode;
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon,
  color = 'primary'
}) => {
  const colorMap = {
    primary: colors.primary[500],
    secondary: colors.secondary[500],
    accent: colors.accent[500],
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
  };

  const backgroundColorMap = {
    primary: colors.primary[50],
    secondary: colors.secondary[50],
    accent: colors.accent[50],
    success: '#f0fdf4',
    warning: '#fffbeb',
    error: '#fef2f2',
  };

  const changeColorMap = {
    increase: colors.success,
    decrease: colors.error,
    neutral: colors.text.secondary,
  };

  const cardContentStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const leftSectionStyles: React.CSSProperties = {
    flex: 1,
  };

  const iconContainerStyles: React.CSSProperties = {
    width: '48px',
    height: '48px',
    backgroundColor: backgroundColorMap[color],
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: colorMap[color],
  };

  const titleStyles: React.CSSProperties = {
    fontSize: '0.875rem',
    color: colors.text.secondary,
    margin: '0 0 0.5rem 0',
    fontWeight: '500',
  };

  const valueStyles: React.CSSProperties = {
    fontSize: '2rem',
    fontWeight: '700',
    color: colors.text.primary,
    margin: '0 0 0.25rem 0',
    lineHeight: 1.2,
  };

  const changeStyles: React.CSSProperties = {
    fontSize: '0.875rem',
    color: change ? changeColorMap[change.type] : colors.text.secondary,
    margin: 0,
    fontWeight: '500',
  };

  return (
    <Card padding="lg" shadow="sm">
      <div style={cardContentStyles}>
        <div style={leftSectionStyles}>
          <h3 style={titleStyles}>{title}</h3>
          <p style={valueStyles}>{value}</p>
          {change && (
            <p style={changeStyles}>
              {change.type === 'increase' && '↗ '}
              {change.type === 'decrease' && '↘ '}
              {change.value}
            </p>
          )}
        </div>
        
        <div style={iconContainerStyles}>
          {icon}
        </div>
      </div>
    </Card>
  );
};

// Stats Grid Component
interface StatsGridProps {
  stats: Omit<StatCardProps, 'color'>[];
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
  const gridStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  };

  const colors_array: StatCardProps['color'][] = ['primary', 'secondary', 'accent', 'success'];

  return (
    <div style={gridStyles}>
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          {...stat}
          color={colors_array[index % colors_array.length]}
        />
      ))}
    </div>
  );
};
