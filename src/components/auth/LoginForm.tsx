'use client';

import React, { useState } from 'react';
import { Button, Input, Card } from '@/components/ui';
import { EmailIcon, PasswordIcon, EyeIcon, EyeOffIcon, GoogleIcon, AlertCircleIcon } from '@/components/icons';
import { useAuthLogin } from '@/hooks/useAuthLogin';
import { colors } from '@/styles/design-system';

interface LoginFormProps {
  onSuccess?: () => void;
  showGoogleLogin?: boolean;
  className?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  showGoogleLogin = true,
  className = '',
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const { login, loginWithGoogle, isLoading, error } = useAuthLogin();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (password: string): boolean => {
    if (!password) {
      setPasswordError('Password is required');
      return false;
    }
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    const result = await login({ email, password });
    
    if (result?.ok && onSuccess) {
      onSuccess();
    }
  };

  const handleGoogleLogin = async () => {
    const result = await loginWithGoogle();
    
    if (result?.ok && onSuccess) {
      onSuccess();
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Card padding="lg" shadow="lg" className={className}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ 
          fontSize: '1.875rem', 
          fontWeight: '700', 
          color: colors.text.primary,
          marginBottom: '0.5rem' 
        }}>
          Welcome Back
        </h1>
        <p style={{ 
          color: colors.text.secondary,
          fontSize: '1rem' 
        }}>
          Sign in to your account to continue
        </p>
      </div>

      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.75rem 1rem',
          backgroundColor: '#fef2f2',
          border: `1px solid ${colors.error}`,
          borderRadius: '0.5rem',
          marginBottom: '1.5rem',
          color: colors.error,
        }}>
          <AlertCircleIcon size={16} />
          <span style={{ fontSize: '0.875rem' }}>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <Input
          type="email"
          label="Email Address"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (emailError) validateEmail(e.target.value);
          }}
          onBlur={() => validateEmail(email)}
          error={emailError}
          leftIcon={<EmailIcon size={18} color={colors.text.secondary} />}
          required
        />

        <Input
          type={showPassword ? 'text' : 'password'}
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (passwordError) validatePassword(e.target.value);
          }}
          onBlur={() => validatePassword(password)}
          error={passwordError}
          leftIcon={<PasswordIcon size={18} color={colors.text.secondary} />}
          rightIcon={
            <button
              type="button"
              onClick={togglePasswordVisibility}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {showPassword ? (
                <EyeOffIcon size={18} color={colors.text.secondary} />
              ) : (
                <EyeIcon size={18} color={colors.text.secondary} />
              )}
            </button>
          }
          required
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
        >
          Sign In
        </Button>
      </form>

      {showGoogleLogin && (
        <>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            margin: '1.5rem 0',
            gap: '1rem',
          }}>
            <div style={{
              flex: 1,
              height: '1px',
              backgroundColor: colors.border.medium,
            }} />
            <span style={{
              color: colors.text.secondary,
              fontSize: '0.875rem',
              fontWeight: '500',
            }}>
              OR
            </span>
            <div style={{
              flex: 1,
              height: '1px',
              backgroundColor: colors.border.medium,
            }} />
          </div>

          <Button
            type="button"
            variant="outline"
            size="lg"
            fullWidth
            onClick={handleGoogleLogin}
            disabled={isLoading}
            leftIcon={<GoogleIcon size={18} />}
          >
            Continue with Google
          </Button>
        </>
      )}

      <div style={{
        textAlign: 'center',
        marginTop: '1.5rem',
        color: colors.text.secondary,
        fontSize: '0.875rem',
      }}>
        <p>
          Don't have an account?{' '}
          <a
            href="/register"
            style={{
              color: colors.primary[500],
              textDecoration: 'none',
              fontWeight: '500',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textDecoration = 'underline';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textDecoration = 'none';
            }}
          >
            Sign up
          </a>
        </p>
      </div>
    </Card>
  );
};
