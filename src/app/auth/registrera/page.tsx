'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthCard } from '@/components/auth/AuthCard';
import { GoogleButton } from '@/components/auth/GoogleButton';
import { AuthDivider } from '@/components/auth/AuthDivider';
import { AuthForm } from '@/components/auth/AuthForm';
import { AuthFooter } from '@/components/auth/AuthFooter';
import { useAuthForm } from '@/lib/auth/hooks/useAuthForm';
import { useGoogleAuth } from '@/lib/auth/hooks/useGoogleAuth';
import { useAuth } from '@/lib/auth/hooks/useAuth';

import { DEFAULT_LOGIN_REDIRECT_PATH } from '@/lib/constants/routes';
import { APP_NAME } from '@/lib/constants/site';

export default function RegisterPage() {
  const router = useRouter();

  const { authenticated, loading: authLoading } = useAuth();

  const {
    loading: formLoading,
    error,
    handleSubmit,
    setError,
  } = useAuthForm({
    mode: 'register',
  });

  const { loading: googleLoading, handleGoogleSignIn } = useGoogleAuth({
    onSuccess: () => router.push(DEFAULT_LOGIN_REDIRECT_PATH),
    onError: (error) => setError(error.message),
  });

  useEffect(() => {
    if (!authLoading && authenticated) {
      router.push(DEFAULT_LOGIN_REDIRECT_PATH);
    }
  }, [authenticated, authLoading, router]);

  const isLoading = formLoading || googleLoading || authLoading;

  if (authLoading || authenticated) {
    return <div>Laddar...</div>;
  }

  return (
    <AuthCard
      title={`Skapa ett konto på ${APP_NAME}`}
      description="Välj hur du vill registrera dig"
      footer={
        <AuthFooter
          mode="register"
          onNavigate={() => router.push('/auth/login')}
        />
      }
    >
      <GoogleButton
        mode="register"
        onSuccess={handleGoogleSignIn}
        isLoading={isLoading}
      />
      <AuthDivider text="Eller registrera med email" />
      <AuthForm
        mode="register"
        onSubmit={handleSubmit}
        isLoading={isLoading}
        error={error}
      />
    </AuthCard>
  );
}
