// * ==========================================================================
// *                 SERVICE: SEND VERIFICATION EMAIL (HTTP API)
// * ==========================================================================
import { getEnvVar } from '@/lib/utils/env'; // Updated import path
import { API_AUTH_PATHS } from '@/lib/constants/routes'; // Import API_AUTH_PATHS
import { APP_NAME } from '@/lib/constants/site'; // Import APP_NAME

// ** Function: sendVerificationEmail ** //
/**
 * Constructs and sends an email verification message using the Brevo HTTP API.
 * @param email - The recipient's email address.
 * @param token - The unique verification token.
 * @throws Will throw an error if configuration is missing or the API call fails.
 */
export const sendVerificationEmail = async (email: string, token: string) => {
  // * 1. Get Configuration from Environment Variables
  const brevoApiKey = process.env.BREVO_API_KEY; // Use the new variable name
  const senderEmail = process.env.EMAIL_FROM_ADDRESS;
  const senderName = process.env.EMAIL_FROM_NAME;
  const baseUrl = getEnvVar('NEXT_PUBLIC_APP_URL'); // Base URL for verification link

  // * 2. Validate Configuration
  if (!brevoApiKey || !senderEmail || !senderName || !baseUrl) {
    console.error(
      'Email Service Error: Missing required environment variables (BREVO_API_KEY, EMAIL_FROM_ADDRESS, EMAIL_FROM_NAME, NEXT_PUBLIC_APP_URL)'
    );
    throw new Error('Email service configuration is incomplete.');
  }

  // * 3. Construct Verification URL and Payload
  const verificationUrl = `${baseUrl}${API_AUTH_PATHS.VERIFY_EMAIL}?token=${token}`;
  const payload = {
    sender: { name: senderName, email: senderEmail },
    to: [{ email: email }],
    subject: `Verify your email address for ${APP_NAME}`,
    // TODO: Replace with a more robust HTML template solution (e.g., React Email)
    htmlContent: `
      <h1>Verify your email address</h1>
      <p>Thank you for registering with ${APP_NAME}!</p>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationUrl}" target="_blank">Verify my email</a>
      <p>This link is valid for 24 hours.</p>
      <p>If you did not register, please ignore this email.</p>
      <br>
      <p>Best regards,</p>
      <p>The ${APP_NAME} Team</p>
    `,
  };

  // * 4. Send Email via Brevo HTTP API
  console.log(`Attempting to send email to ${email} via Brevo HTTP API...`);
  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': brevoApiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    // * 5. Handle API Response
    if (!response.ok) {
      // Attempt to parse error body for more details
      let errorBody = {};
      try {
        errorBody = await response.json();
      } catch {
        // Ignore if body isn't valid JSON
      }
      console.error(
        'Brevo HTTP API Error:',
        response.status,
        response.statusText,
        errorBody
      );
      throw new Error(
        `Failed to send email via Brevo HTTP API: ${response.status} ${response.statusText}`
      );
    }

    const responseData = await response.json();
    console.log(
      `Email dispatched successfully via Brevo HTTP API to ${email}:`,
      responseData // Contains messageId etc.
    );
    // No specific return value needed on success, caller assumes success if no error is thrown.
  } catch (error) {
    console.error(
      `Error during Brevo HTTP API call for ${email}:`,
      error instanceof Error ? error.message : error
    );
    // Re-throw the error to allow the calling function (API route) to handle it
    throw error;
  }
}; 