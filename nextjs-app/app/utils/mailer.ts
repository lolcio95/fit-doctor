import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

export const sendVerificationEmail = async (
  {to, from, subject, html}: 
  {to: string; from: string; subject: string; html: string;}
) => {
  if (!process.env.NEXT_PUBLIC_BASE_URL) {
    throw new Error('NEXT_PUBLIC_BASE_URL is not set in env');
  }

  try {
    await resend.emails.send({
      from,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error('Error sending verification email:', error);
  }
};
