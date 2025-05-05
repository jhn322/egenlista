import { USER_ROLES, UserRole } from '@/lib/auth/constants/auth';

/**
 * Konverterar en användarroll till en läsbar text
 */
export const formatRole = (role: UserRole): string => {
  const roleMap: Record<UserRole, string> = {
    [USER_ROLES.USER]: 'User',
    [USER_ROLES.ADMIN]: 'Admin',
  };
  return roleMap[role] || role;
};

/**
 * Kontrollerar om användaren har tillräckliga rättigheter baserat på hierarki
 */
export const hasRequiredRole = (
  userRole: UserRole,
  requiredRole: UserRole | UserRole[]
): boolean => {
  // Uppdaterad hierarki
  const roleHierarchy: UserRole[] = [USER_ROLES.USER, USER_ROLES.ADMIN];
  const userRoleIndex = roleHierarchy.indexOf(userRole);

  if (userRoleIndex === -1) return false;

  if (Array.isArray(requiredRole)) {
    return requiredRole.some((role) => {
      const requiredRoleIndex = roleHierarchy.indexOf(role);
      return requiredRoleIndex !== -1 && userRoleIndex >= requiredRoleIndex;
    });
  } else {
    const requiredRoleIndex = roleHierarchy.indexOf(requiredRole);
    return requiredRoleIndex !== -1 && userRoleIndex >= requiredRoleIndex;
  }
};
