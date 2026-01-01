import { Resend } from "resend";

export type EmailParams = {
  to: string;
  subject: string;
  text: string;
};

export const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendEmail({ to, subject, text }: EmailParams) {
  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to,
    subject,
    text,
  });

  if (error) {
    throw new Error(`Failed to send email: ${error.message}`);
  }

  return data;
}
