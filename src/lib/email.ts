import { Resend } from "resend";

export type EmailParams = {
  to: string;
  subject: string;
  text: string;
};

export const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendEmail({ to, subject, text }: EmailParams) {
  // Skip in unit tests
  if (process.env.NODE_ENV === "test") {
    return;
  }

  const isDev = process.env.NODE_ENV !== "production";

  const { data, error } = await resend.emails.send({
    from: isDev
      ? "Learn-Japanese <onboarding@resend.dev>"
      : process.env.EMAIL_FROM!,
    to: isDev ? process.env.DEV_MAIL! : to,
    subject,
    text,
  });

  if (error) {
    throw new Error(`Failed to send email: ${error.message}`);
  }

  return data;
}
