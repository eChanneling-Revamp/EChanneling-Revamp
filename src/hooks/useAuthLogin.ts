import { useState } from 'react';
import { signIn, SignInResponse } from 'next-auth/react';

interface UseAuthLoginReturn {
  login: (credentials: { email: string; password: string }) => Promise<SignInResponse | undefined>;
  loginWithGoogle: () => Promise<SignInResponse | undefined>;
  isLoading: boolean;
  error: string | null;
}

export const useAuthLogin = (): UseAuthLoginReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: { email: string; password: string }) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn('credentials', {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else if (result?.ok) {
        // Redirect to dashboard on success
        window.location.href = '/dashboard';
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn('google', {
        callbackUrl: '/dashboard',
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    loginWithGoogle,
    isLoading,
    error,
  };
};
