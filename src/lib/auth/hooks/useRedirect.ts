'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { AUTH_PATHS, DEFAULT_LOGIN_REDIRECT_PATH } from '@/lib/constants/routes';

interface UseRedirectProps {
  defaultRedirect?: string;
}

export const useRedirect = ({
  defaultRedirect = DEFAULT_LOGIN_REDIRECT_PATH,
}: UseRedirectProps = {}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const getCallbackUrl = (): string => {
    return searchParams?.get('callbackUrl') || defaultRedirect;
  };

  const redirectToCallback = (): void => {
    router.push(getCallbackUrl());
  };

  const redirectToLogin = (additionalParams?: Record<string, string>): void => {
    const currentPath =
      typeof window !== 'undefined' ? window.location.href : '';
    let path = `${AUTH_PATHS.LOGIN}?callbackUrl=${encodeURIComponent(currentPath)}`;

    if (additionalParams) {
      const params = new URLSearchParams();
      Object.entries(additionalParams).forEach(([key, value]) => {
        params.append(key, value);
      });
      path += `&${params.toString()}`;
    }

    router.push(path);
  };

  const redirectToRegister = (): void => {
    router.push(AUTH_PATHS.REGISTER);
  };

  return {
    getCallbackUrl,
    redirectToCallback,
    redirectToLogin,
    redirectToRegister,
  };
};
