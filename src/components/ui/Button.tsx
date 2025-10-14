import React from 'react';
import { colors, components, borderRadius, shadows } from '@/styles/design-system';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    children,
    className = '',
    disabled,
    ...props
  }, ref) => {
    const baseStyles = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      fontWeight: '500',
      borderRadius: borderRadius.lg,
      border: 'none',
      cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
      transition: 'all 150ms ease-in-out',
      outline: 'none',
      position: 'relative' as const,
      width: fullWidth ? '100%' : 'auto',
    };

    const sizeStyles = {
      sm: {
        height: components.button.height.sm,
        padding: components.button.padding.sm,
        fontSize: '0.875rem',
      },
      md: {
        height: components.button.height.md,
        padding: components.button.padding.md,
        fontSize: '1rem',
      },
      lg: {
        height: components.button.height.lg,
        padding: components.button.padding.lg,
        fontSize: '1.125rem',
      },
    };

    const variantStyles = {
      primary: {
        backgroundColor: colors.primary[500],
        color: colors.text.inverse,
        boxShadow: shadows.sm,
      },
      secondary: {
        backgroundColor: colors.secondary[500],
        color: colors.text.inverse,
        boxShadow: shadows.sm,
      },
      outline: {
        backgroundColor: 'transparent',
        color: colors.primary[500],
        border: `1px solid ${colors.primary[500]}`,
      },
      ghost: {
        backgroundColor: 'transparent',
        color: colors.primary[500],
      },
      danger: {
        backgroundColor: colors.error,
        color: colors.text.inverse,
        boxShadow: shadows.sm,
      },
    };

    const hoverStyles = {
      primary: { backgroundColor: colors.primary[600] },
      secondary: { backgroundColor: colors.secondary[600] },
      outline: { backgroundColor: colors.primary[50] },
      ghost: { backgroundColor: colors.primary[50] },
      danger: { backgroundColor: '#dc2626' },
    };

    const disabledStyles = {
      opacity: 0.6,
      cursor: 'not-allowed',
    };

    const buttonStyle = {
      ...baseStyles,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...(disabled || isLoading ? disabledStyles : {}),
    };

    return (
      <button
        ref={ref}
        style={buttonStyle}
        className={className}
        disabled={disabled || isLoading}
        onMouseEnter={(e) => {
          if (!disabled && !isLoading) {
            Object.assign(e.currentTarget.style, hoverStyles[variant]);
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled && !isLoading) {
            Object.assign(e.currentTarget.style, variantStyles[variant]);
          }
        }}
        {...props}
      >
        {isLoading && (
          <div
            style={{
              width: '1rem',
              height: '1rem',
              border: '2px solid transparent',
              borderTop: '2px solid currentColor',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
        )}
        {!isLoading && leftIcon}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
