import nodemailer from "nodemailer";

import { getEnv } from "@/lib/env";

export async function sendGreetingEmail(params: { to: string; name: string }) {
  const env = getEnv();

  if (!env.SMTP_HOST || !env.SMTP_FROM) {
    console.info(`[email] Welcome ${params.name} <${params.to}> to Pantry Routes.`);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    auth:
      env.SMTP_USER && env.SMTP_PASS
        ? {
            user: env.SMTP_USER,
            pass: env.SMTP_PASS,
          }
        : undefined,
  });
try {
  await transporter.sendMail({
    from: env.SMTP_FROM,
    to: params.to,
    subject: "Welcome to Pantry Routes",
    text: `Hi ${params.name}, welcome to Pantry Routes. Your recipe shelf is ready.`,
    html: `<p>Hi ${params.name},</p><p>Welcome to <strong>Pantry Routes</strong>. Your recipe shelf is ready.</p>`,
  });
  console.log(`📧 Correo enviado con éxito a: ${params.to}`);
}
catch (error) {
  console.error(`[email] Failed to send greeting email to ${params.name} <${params.to}>:`, error);
}
}
