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
      subject: "Welcome to Pantry Routes 🍳",
      text: `Hi ${params.name}, welcome to Pantry Routes. Your recipe shelf is ready.`,
      html: `
<div style="background-color: #f6f5f2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 40px 20px; color: #3c3a36; line-height: 1.6;">
  <div style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: 1px solid #eadecf;">
    <!-- Header Banner -->
    <div style="background-color: #5f6f52; padding: 40px 30px; text-align: center; color: #ffffff;">
      <h1 style="margin: 0; font-family: Georgia, serif; font-size: 28px; font-weight: normal; letter-spacing: 0.5px;">Pantry Routes</h1>
      <p style="margin: 5px 0 0 0; font-size: 14px; color: #e5ecd9; text-transform: uppercase; letter-spacing: 2px;">Your Warm Little Kitchen</p>
    </div>
    
    <!-- Body Content -->
    <div style="padding: 40px 30px;">
      <h2 style="margin-top: 0; color: #2c2a29; font-size: 20px; font-weight: 600;">Welcome, ${params.name}!</h2>
      <p style="font-size: 15px; color: #5a5854; margin-bottom: 25px;">
        We're absolutely delighted to have you join us at <strong>Pantry Routes</strong>. Your personal recipe shelf is set up and ready to be filled with your culinary favorites.
      </p>
      
      <!-- CTA Box -->
      <div style="background-color: #f9f8f6; border-left: 4px solid #a9b388; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <p style="margin: 0 0 12px 0; font-size: 14px; font-weight: bold; color: #5f6f52;">Get Started:</p>
        <p style="margin: 0 0 18px 0; font-size: 14px; color: #5a5854;">
          Log in to your account, explore our starting recipe cards, and start saving your favorite culinary inspirations.
        </p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/auth/login" style="display: inline-block; background-color: #5f6f52; color: #ffffff; text-decoration: none; padding: 12px 24px; font-size: 14px; font-weight: bold; border-radius: 25px;">
          Explore Your Recipe Shelf
        </a>
      </div>
      
      <!-- Signature -->
      <p style="font-size: 14px; color: #7c7a77; margin: 30px 0 0 0;">
        Warmest regards,<br>
        <strong>The Pantry Routes Team</strong>
      </p>
    </div>
    
    <!-- Footer -->
    <div style="background-color: #fdfcfb; padding: 20px 30px; text-align: center; border-top: 1px solid #f3ebe1;">
      <p style="margin: 0; font-size: 12px; color: #a3a19e;">
        You received this email because you registered at Pantry Routes.<br>
        © 2026 Pantry Routes. Happy cooking!
      </p>
    </div>
  </div>
</div>
`,
    });
    console.log(`📧 Correo enviado con éxito a: ${params.to}`);
  } catch (error) {
    console.error(`[email] Failed to send greeting email to ${params.name} <${params.to}>:`, error);
  }
}
