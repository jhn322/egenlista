// * ==========================================================================
// *                             ROUTE CONSTANTS
// * ==========================================================================
// Helps ensure consistency and ease of updates for all route paths in the application.

// ** Site-wide Public Paths ** //
export const SITE_PATHS = {
  HOME: '/',
  ABOUT: '/om-oss', // Example, adjust if needed
  CONTACT: '/kontakta-oss', // Example, adjust if needed
  TERMS: '/anvandarvillkor',
  PRIVACY: '/integritetspolicy',
} as const;

// ** Authentication Page Paths ** //
export const AUTH_PATHS = {
  LOGIN: '/auth/logga-in',
  REGISTER: '/auth/registrera',
  FORGOT_PASSWORD: '/auth/glomt-losenord',
  RESET_PASSWORD: '/auth/aterstall-losenord',
  VERIFY_EMAIL_INFO_PAGE: '/auth/verifiering', // Page shown when email verification is pending or to request a new link
  AUTH_ERROR: '/auth/fel', // Placeholder, page not yet created
  UNAUTHORIZED: '/auth/obehorig', // Placeholder, page not yet created
} as const;

// ** Protected Area Paths (require login) ** //
export const PROTECTED_PATHS = {
  MINA_SIDOR_BASE: '/mina-sidor',
  MINA_SIDOR_DASHBOARD: '/mina-sidor/instrumentpanel', // Example
  MINA_SIDOR_KONTAKTVY: '/mina-sidor/kontaktvy',
  MINA_SIDOR_INSTÄLLNINGAR: '/mina-sidor/installningar', // Example
  // Add other protected paths here
} as const;

// ** API Authentication Paths ** //
// These might be implicitly handled by NextAuth.js, but good to have if directly used
export const API_AUTH_PATHS = {
  REGISTER: '/api/auth/register',
  VERIFY_EMAIL: '/api/auth/verify-email', // API endpoint that handles the token
  RESEND_VERIFICATION_EMAIL: '/api/auth/resend-verification', // API endpoint to resend verification
  FORGOT_PASSWORD: '/api/auth/glomt-losenord', // API endpoint to request password reset
  RESET_PASSWORD: '/api/auth/aterstall-losenord', // API endpoint to reset password with token
} as const;

// ** API Application-Specific Paths ** //
export const API_APP_PATHS = {
  CONTACTS_BASE: '/api/contacts',
  // For dynamic paths like /api/contacts/[id], construct them in your code using this base:
  // e.g., `${API_APP_PATHS.CONTACTS_BASE}/${contactId}`
  // Or, a helper function can be added here if preferred:
  // CONTACT_BY_ID: (id: string) => `/api/contacts/${id}`,
} as const;

// ** Default Redirects ** //
export const DEFAULT_LOGIN_REDIRECT_PATH: string =
  PROTECTED_PATHS.MINA_SIDOR_BASE;
export const DEFAULT_LOGOUT_REDIRECT_PATH: string = SITE_PATHS.HOME; // Or AUTH_PATHS.LOGIN

// ** Public Route Patterns ** //
// An array of all paths/patterns considered public.
// Useful for middleware or client-side routing logic.
// Note: API routes are typically handled separately by middleware logic (e.g., checking if path starts with /api/auth)
export const PUBLIC_ROUTE_PATTERNS: string[] = [
  SITE_PATHS.HOME,
  SITE_PATHS.ABOUT,
  SITE_PATHS.CONTACT,
  SITE_PATHS.TERMS,
  SITE_PATHS.PRIVACY,
  AUTH_PATHS.LOGIN,
  AUTH_PATHS.REGISTER,
  AUTH_PATHS.FORGOT_PASSWORD,
  AUTH_PATHS.RESET_PASSWORD,
  AUTH_PATHS.VERIFY_EMAIL_INFO_PAGE, // This is '/auth/verify-needed'
  AUTH_PATHS.AUTH_ERROR,
  // The actual email verification link (e.g., /api/auth/verify-email?token=...)
  // is handled by the API route and middleware (isApiAuthRoute).
  // It doesn't need to be listed here as a page pattern.
];

// ** API Route Prefixes ** //
export const API_ROUTE_PREFIX = '/api';
export const API_AUTH_ROUTE_PREFIX = '/api/auth'; // Default NextAuth prefix

// ** Special Route Identifiers (if needed by middleware or logic) ** //
export const ROOT_PATH = '/';

// Paths that should use a minimal layout (e.g., no Navbar/Footer)
// Includes auth paths and public signup paths
export const ISOLATED_LAYOUT_PATHS = [
  ...Object.values(AUTH_PATHS),
  '/signup/:path*', // Match /signup/ and any sub-paths like /signup/[userId]/tack
];
