import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth/options';
import { UserRole } from '@/lib/auth/constants/auth';
import { AUTH_PATHS } from '@/lib/constants/routes';
import { hasRequiredRole } from './auth';

/**
 * Hämtar aktiv session på serversidan
 */
export const getSession = async () => {
  return await getServerSession(authOptions);
};

/**
 * Kontrollerar om användaren har rätt roll (server-side).
 * Omdirigerar till obehörig-sidan om fel roll.
 * Används EFTER att middleware har säkerställt inloggning.
 */
export const requireRole = async (
  requiredRole: UserRole | UserRole[],
  unauthorizedUrl = AUTH_PATHS.UNAUTHORIZED
) => {
  const session = await getSession(); // Hämta session direkt

  // Om ingen session finns (bör inte hända pga middleware, men som säkerhetsåtgärd)
  // eller om användaren saknar roll
  if (!session?.user?.role) {
    console.error('requireRole: Användare saknar session eller roll.');
    redirect(AUTH_PATHS.LOGIN); // Use AUTH_PATHS
    return null; // Returnera null för att undvika TS-fel nedan
  }

  const userRole = session.user.role as UserRole;

  if (!hasRequiredRole(userRole, requiredRole)) {
    redirect(unauthorizedUrl);
  }

  // Returnera sessionen så den kan användas på sidan om kontrollen passerar
  return session;
};
