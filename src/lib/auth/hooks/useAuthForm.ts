import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';
import { registerFormSchema } from '@/lib/auth/validation/register';
import type { AuthFormData } from '@/components/auth/AuthForm/types';
import { AUTH_MESSAGES } from '@/lib/auth/constants/auth';
import { AUTH_PATHS, DEFAULT_LOGIN_REDIRECT_PATH } from '@/lib/constants/routes';
import { registerUser } from '@/services/auth/mutations/register';
import { z } from 'zod';

interface UseAuthFormProps {
  mode: 'login' | 'register';
  onSuccess?: () => void;
}

export const useAuthForm = ({ mode, onSuccess }: UseAuthFormProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: AuthFormData) => {
    setLoading(true);
    setError(null);

    try {
      //* Validera registreringsdata
      if (mode === 'register') {
        const validatedData = registerFormSchema.parse({
          name: data.name,
          email: data.email,
          password: data.password,
          confirmPassword: data.confirmPassword,
        });

        //* Registrera användare via API
        const result = await registerUser({
          name: validatedData.name,
          email: validatedData.email,
          password: validatedData.password,
        });

        if (!result.success) {
          throw new Error(
            result.message || AUTH_MESSAGES.ERROR_REGISTRATION_FAILED
          );
        }

        // Show success toast and redirect to verify needed page
        toast.success(result.message || AUTH_MESSAGES.INFO_VERIFICATION_EMAIL_SENT);
        router.push(
          `${AUTH_PATHS.VERIFY_EMAIL_INFO_PAGE}?email=${encodeURIComponent(validatedData.email)}`
        );
      } else {
        //* Logga in användare
        const result = await signIn('credentials', {
          redirect: false,
          email: data.email,
          password: data.password,
        });

        if (result?.error) {
          // Hantera specifika fel från NextAuth authorize
          if (result.error === 'CredentialsSignin') {
            // NextAuth ger detta generiska fel, men vi kan härleda det från context
            setError(AUTH_MESSAGES.ERROR_INVALID_CREDENTIALS);
          } else if (result.error === 'User not found') {
            setError(AUTH_MESSAGES.ERROR_INVALID_CREDENTIALS);
          } else if (result.error === 'Incorrect password') {
            setError(AUTH_MESSAGES.ERROR_INVALID_CREDENTIALS);
          } else if (result.error === 'EMAIL_NOT_VERIFIED') {
            // Redirect to verify needed page instead of setting error
            toast.error(AUTH_MESSAGES.ERROR_EMAIL_NOT_VERIFIED);
            router.push(
              `${AUTH_PATHS.VERIFY_EMAIL_INFO_PAGE}?email=${encodeURIComponent(data.email)}`
            );
          } else {
            setError(result.error || AUTH_MESSAGES.ERROR_LOGIN_FAILED);
          }
        } else {
          // Successful login
          toast.success(AUTH_MESSAGES.SUCCESS_LOGIN);
          if (onSuccess) {
            onSuccess();
          } else {
            // Fallback if onSuccess is not provided
            router.push(DEFAULT_LOGIN_REDIRECT_PATH);
            console.warn(
              'useAuthForm: onSuccess callback missing after successful login. Redirecting to default login redirect path.'
            );
          }
        }
      }
    } catch (error) {
      // Hantera Zod valideringsfel specifikt
      if (error instanceof z.ZodError) {
        const errorMessage = error.errors.map((e) => e.message).join(', ');
        setError(errorMessage);
        toast.error(errorMessage);
      } else if (error instanceof Error) {
        setError(error.message);
        toast.error(error.message);
      } else {
        // Fallback for unknown errors
        setError(AUTH_MESSAGES.ERROR_DEFAULT);
        toast.error(AUTH_MESSAGES.ERROR_DEFAULT);
      }
      console.error('AuthForm Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    handleSubmit,
    setError,
  };
};
