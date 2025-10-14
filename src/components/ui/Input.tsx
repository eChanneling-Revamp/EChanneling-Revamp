import React from 'react';
import { colors, components, borderRadius, shadows } from '@/styles/design-system';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  success?: string;
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    label,
    error,
    success,
    size = 'md',
    leftIcon,
    rightIcon,
    fullWidth = true,
    className = '',
    type = 'text',
    ...props
  }, ref) => {
    const hasError = !!error;
    const hasSuccess = !!success;
    const hasIcon = leftIcon || rightIcon;

    const containerStyles = {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '0.5rem',
      width: fullWidth ? '100%' : 'auto',
    };

    const labelStyles = {
      fontSize: '0.875rem',
      fontWeight: '500',
      color: colors.text.primary,
      marginBottom: '0.25rem',
    };

    const inputContainerStyles = {
      position: 'relative' as const,
      display: 'flex',
      alignItems: 'center',
    };

    const baseInputStyles = {
      width: '100%',
      border: `1px solid ${hasError ? colors.error : hasSuccess ? colors.success : colors.border.medium}`,
      borderRadius: borderRadius.lg,
      fontSize: '1rem',
      color: colors.text.primary,
      backgroundColor: colors.background.primary,
      transition: 'all 150ms ease-in-out',
      outline: 'none',
      paddingLeft: leftIcon ? '2.5rem' : components.input.padding.md.split(' ')[1],
      paddingRight: rightIcon ? '2.5rem' : components.input.padding.md.split(' ')[1],
      paddingTop: components.input.padding.md.split(' ')[0],
      paddingBottom: components.input.padding.md.split(' ')[0],
    };

    const sizeStyles = {
      sm: {
        height: components.input.height.sm,
        fontSize: '0.875rem',
      },
      md: {
        height: components.input.height.md,
        fontSize: '1rem',
      },
      lg: {
        height: components.input.height.lg,
        fontSize: '1.125rem',
      },
    };

    const iconStyles = {
      position: 'absolute' as const,
      top: '50%',
      transform: 'translateY(-50%)',
      color: colors.text.secondary,
      width: '1.25rem',
      height: '1.25rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    };

    const leftIconStyles = {
      ...iconStyles,
      left: '0.75rem',
    };

    const rightIconStyles = {
      ...iconStyles,
      right: '0.75rem',
    };

    const messageStyles = {
      fontSize: '0.875rem',
      marginTop: '0.25rem',
    };

    const errorStyles = {
      ...messageStyles,
      color: colors.error,
    };

    const successStyles = {
      ...messageStyles,
      color: colors.success,
    };

    const inputStyles = {
      ...baseInputStyles,
      ...sizeStyles[size],
    };

    return (
      <div style={containerStyles}>
        {label && (
          <label style={labelStyles}>
            {label}
          </label>
        )}
        
        <div style={inputContainerStyles}>
          {leftIcon && (
            <div style={leftIconStyles}>
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            type={type}
            style={inputStyles}
            className={className}
            onFocus={(e) => {
              e.target.style.borderColor = colors.primary[500];
              e.target.style.boxShadow = `0 0 0 3px ${colors.primary[100]}`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = hasError ? colors.error : hasSuccess ? colors.success : colors.border.medium;
              e.target.style.boxShadow = 'none';
            }}
            {...props}
          />
          
          {rightIcon && (
            <div style={rightIconStyles}>
              {rightIcon}
            </div>
          )}
        </div>
        
        {error && (
          <span style={errorStyles}>
            {error}
          </span>
        )}
        
        {success && !error && (
          <span style={successStyles}>
            {success}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
