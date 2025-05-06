import type { RegisterRequest, RegisterResponse } from '../types/auth';
import { API_AUTH_PATHS } from '@/lib/constants/routes';

/**
 * Registrerar en ny användare via API
 */
export const registerUser = async (
  data: RegisterRequest
): Promise<RegisterResponse> => {
  try {
    const response = await fetch(API_AUTH_PATHS.REGISTER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || 'Ett fel uppstod vid registrering',
      };
    }

    const responseData = await response.json();
    return {
      success: true,
      message: 'Registrering lyckades!',
      user: responseData,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Ett fel uppstod vid registrering',
    };
  }
};
