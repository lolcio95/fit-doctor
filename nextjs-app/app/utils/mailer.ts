import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

export const sendVerificationEmail = async (to: string, token: string, name = '') => {
  if (!process.env.NEXT_PUBLIC_BASE_URL) {
    throw new Error('NEXT_PUBLIC_BASE_URL is not set in env');
  }

  const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL.replace(/\/$/, '')}/api/verify?token=${encodeURIComponent(token)}`;

  const html = `
    <p>Cześć ${name || ''},</p>
    <p>Dziękujemy za rejestrację. Kliknij poniższy link aby zweryfikować swoje konto:</p>
    <p><a href="${verificationUrl}">Weryfikuj konto</a></p>
    <p>Link wygasa po 24 godzinach.</p>
    <hr/>
    <p>Jeśli to nie Ty rejestrowałeś konto, zignoruj tę wiadomość.</p>
  `;

  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to,
      subject: 'Hello World',
      html,
    });
  } catch (error) {
    console.error('Error sending verification email:', error);
  }
};