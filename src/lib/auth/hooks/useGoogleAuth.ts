import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { AUTH_MESSAGES } from '@/lib/auth/constants/auth';
import { DEFAULT_LOGIN_REDIRECT_PATH } from '@/lib/constants/routes';

interface UseGoogleAuthProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useGoogleAuth = ({
  onSuccess,
  onError,
}: UseGoogleAuthProps = {}) => {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signIn('google', {
        callbackUrl: DEFAULT_LOGIN_REDIRECT_PATH,
        redirect: false,
      });

      if (result?.error) {
        onError?.(
          new Error(result.error || AUTH_MESSAGES.ERROR_GOOGLE_SIGNIN_FAILED)
        );
      } else if (result?.ok) {
        onSuccess?.();
      }
    } catch (error) {
      onError?.(
        error instanceof Error
          ? error
          : new Error(AUTH_MESSAGES.ERROR_GOOGLE_SIGNIN_FAILED)
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleGoogleSignIn,
  };
};
