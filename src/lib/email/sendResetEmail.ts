import { getEnvVar } from '@/lib/utils/env';
import { APP_NAME } from '@/lib/constants/site';

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const brevoApiKey = getEnvVar('BREVO_API_KEY');
  const senderEmail = getEnvVar('EMAIL_FROM_ADDRESS');
  const senderName = getEnvVar('EMAIL_FROM_NAME') || APP_NAME;
  const baseUrl = getEnvVar('NEXT_PUBLIC_APP_URL');

  const resetLink = `${baseUrl}/auth/aterstall-losenord?token=${token}`;
  const privacyPolicyUrl = `${baseUrl}/integritetspolicy`;

  const payload = {
    sender: { name: senderName, email: senderEmail },
    to: [{ email: email }],
    subject: `Återställ ditt lösenord för ${APP_NAME}`,
    htmlContent: `
      <body style="margin: 0; padding: 0; width: 100%; color: #1F2937; font-family: Arial, sans-serif;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="padding: 20px;">
              <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #FFFFFF; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <tr>
                  <td align="center" style="padding: 40px 20px 20px 20px; border-bottom: 1px solid #E5E7EB;">
                    <h1 style="color: #004794; margin: 0; font-size: 28px;">${APP_NAME}</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 30px 40px; text-align: left; font-size: 16px; line-height: 1.6;">
                    <h2 style="color: #111827; margin-top: 0; margin-bottom: 20px; font-size: 22px;">Återställ ditt lösenord</h2>
                    <p style="margin-bottom: 20px; color: #374151;">Du har begärt att återställa ditt lösenord för ditt konto med ${APP_NAME}.</p>
                    <p style="margin-bottom: 30px; color: #374151;">Klicka på knappen nedan för att sätta ett nytt lösenord</p>
                    <a href="${resetLink}" target="_blank" rel="noopener noreferrer" style="background-color: #004794; color: #FFFFFF; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Återställ mitt lösenord</a>
                    <p style="margin-top: 30px; margin-bottom: 10px; color: #374151;">Återställningslänken är giltlig i 1 timme.</p>
                    <p style="margin-bottom: 0; color: #374151;">Om du inte har begärt ett lösenordsåterställning, vänligen ignorera detta e-postmeddelande.</p>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding: 20px 40px; border-top: 1px solid #E5E7EB; font-size: 12px; color: #6B7280;">
                    <p style="margin: 0;">${APP_NAME}</p>
                    <p style="margin: 0;">
                      <a href="${privacyPolicyUrl}" target="_blank" rel="noopener noreferrer" style="color: #6B7280; text-decoration: underline;">Integritetspolicy</a>
                    </p>
                    <p style="margin: 10px 0 0 0;">&copy; ${new Date().getFullYear()} ${APP_NAME}.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    `,
  };

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'api-key': brevoApiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBodyText = await response.text();
      let errorBody = {};
      try {
        errorBody = JSON.parse(errorBodyText);
      } catch {
        errorBody = { rawMessage: errorBodyText };
      }
      console.error(
        'Brevo HTTP API Error (Password Reset):',
        response.status,
        response.statusText,
        errorBody
      );
      throw new Error(
        `Failed to send password reset email via Brevo HTTP API: ${response.status} ${response.statusText}. Details: ${errorBodyText}`
      );
    }

    const responseData = await response.json();
    console.log(
      `Password reset email dispatched successfully via Brevo HTTP API to ${email}:`,
      responseData
    );
  } catch (error) {
    console.error(
      `Error during Brevo HTTP API call for password reset to ${email}:`,
      error instanceof Error ? error.message : String(error)
    );
    throw error;
  }
};
