import { USER_ROLES, UserRole } from '@/lib/auth/constants/auth';

/**
 * Konverterar en användarroll till en läsbar text
 */
export const formatRole = (role: UserRole): string => {
  const roleMap: Record<UserRole, string> = {
    [USER_ROLES.USER]: 'User',
    [USER_ROLES.ADMIN]: 'Admin',
    [USER_ROLES.SUPER_ADMIN]: 'Super Admin',
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
  // Uppdaterad hierarki (Super Admin högst)
  const roleHierarchy: UserRole[] = [
    USER_ROLES.USER,
    USER_ROLES.ADMIN,
    USER_ROLES.SUPER_ADMIN,
  ];
  const userRoleIndex = roleHierarchy.indexOf(userRole);

  if (userRoleIndex === -1) return false; // Användarens roll finns inte i hierarkin

  const checkAccess = (reqRole: UserRole): boolean => {
    const requiredRoleIndex = roleHierarchy.indexOf(reqRole);
    // Om den krävda rollen inte finns i hierarkin, eller om användarens rollindex är lägre än den krävda
    if (requiredRoleIndex === -1) return false;
    return userRoleIndex >= requiredRoleIndex;
  };

  if (Array.isArray(requiredRole)) {
    // Om någon av de krävda rollerna uppfylls
    return requiredRole.some(checkAccess);
  } else {
    return checkAccess(requiredRole);
  }
};
