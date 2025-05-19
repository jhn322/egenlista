'use client';

import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { DEFAULT_LOGOUT_REDIRECT_PATH } from '@/lib/constants/routes';
import { LogOutIcon } from '@/components/icons/logout-icon';

interface LogoutButtonProps {
  children?: React.ReactNode;
  className?: string;
}

export const LogoutButton = ({ children, className }: LogoutButtonProps) => {
  const handleLogout = () => {
    signOut({ callbackUrl: DEFAULT_LOGOUT_REDIRECT_PATH });
  };

  return (
    <Button
      onClick={handleLogout}
      variant="ghost" // Eller annan passande variant
      className={`flex items-center gap-2 ${className || ''}`}
    >
      {children || (
        <>
          <LogOutIcon className="h-4 w-4" />
          <span>Logga ut</span>
        </>
      )}
    </Button>
  );
};
