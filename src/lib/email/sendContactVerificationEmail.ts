import { APP_NAME } from '@/lib/constants/site';

export const sendContactVerificationEmail = async (
  email: string,
  token: string
) => {
  const brevoApiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.EMAIL_FROM_ADDRESS;
  const senderName = process.env.EMAIL_FROM_NAME;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!brevoApiKey || !senderEmail || !senderName || !baseUrl) {
    console.error(
      'Email Service Error: Missing required environment variables (BREVO_API_KEY, EMAIL_FROM_ADDRESS, EMAIL_FROM_NAME, NEXT_PUBLIC_APP_URL)'
    );
    throw new Error('Email service configuration is incomplete.');
  }

  const verificationUrl = `${baseUrl}/api/contacts/verify-email?token=${token}`;
  const payload = {
    sender: { name: senderName, email: senderEmail },
    to: [{ email }],
    subject: `Bekräfta din e-postadress för ${APP_NAME}`,
    htmlContent: `
      <h1>Bekräfta din e-postadress</h1>
      <p>Tack för att du registrerar dig!</p>
      <p>Klicka på länken nedan för att bekräfta din e-postadress och slutföra din registrering:</p>
      <a href="${verificationUrl}" target="_blank">Bekräfta min e-post</a>
      <p>Denna länk är giltig i 24 timmar.</p>
      <p>Om du inte har registrerat dig kan du ignorera detta mail.</p>
      <br>
      <p>Vänliga hälsningar,</p>
      <p>${APP_NAME}</p>
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
      let errorBody = {};
      try {
        errorBody = await response.json();
      } catch {}
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
    console.log(`Contact verification email sent to ${email}:`, responseData);
  } catch (error) {
    console.error(
      `Error sending contact verification email to ${email}:`,
      error instanceof Error ? error.message : error
    );
    throw error;
  }
};
