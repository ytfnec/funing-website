import nodemailer from 'nodemailer';

/**
 * Contact notification email via nodemailer + SMTP.
 *
 * Configure via environment variables (wrangler secrets / .env):
 *   SMTP_HOST       e.g. smtp.example.com
 *   SMTP_PORT       e.g. 465 (SSL) or 587 (STARTTLS)
 *   SMTP_USER       SMTP login username
 *   SMTP_PASS       SMTP login password
 *   SMTP_FROM       optional "From" address (defaults to SMTP_USER)
 *   CONTACT_NOTIFY_TO  optional recipient for contact notifications (defaults to info@fnec.net)
 *
 * If SMTP is not configured, sendContactNotification silently no-ops so the
 * contact form keeps working locally without a mail server.
 */

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '465', 10);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_FROM = process.env.SMTP_FROM || SMTP_USER || 'no-reply@fnec.net';
const CONTACT_NOTIFY_TO = process.env.CONTACT_NOTIFY_TO || 'info@fnec.net';

export function isMailerConfigured(): boolean {
  return Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS);
}

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: {
        user: SMTP_USER!,
        pass: SMTP_PASS!,
      },
    });
  }
  return transporter;
}

export interface ContactNotification {
  type: string;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  location?: string | null;
  productInterest?: string | null;
  preferredContact?: string | null;
  bestTime?: string | null;
  message?: string | null;
}

const TYPE_LABELS: Record<string, string> = {
  quote: 'Quote Request',
  oem: 'OEM/ODM Inquiry',
  product: 'Product Inquiry',
  general: 'General Inquiry',
  call: 'Callback Request',
  custom: 'Custom Request',
};

function buildEmailBody(data: ContactNotification): string {
  const lines: string[] = [
    `New contact form submission from ${data.name}`,
    '────────────────────────────────────────────',
    `Type:         ${TYPE_LABELS[data.type] || data.type}`,
    `Name:         ${data.name}`,
    `Email:        ${data.email}`,
  ];

  if (data.phone) lines.push(`Phone:        ${data.phone}`);
  if (data.company) lines.push(`Company:      ${data.company}`);
  if (data.location) lines.push(`Location:     ${data.location}`);
  if (data.productInterest) lines.push(`Product:      ${data.productInterest}`);
  if (data.preferredContact) lines.push(`Preferred:    ${data.preferredContact}`);
  if (data.bestTime) lines.push(`Best time:    ${data.bestTime}`);
  if (data.message) {
    lines.push('', 'Message:', '────────────────────────────────────────', data.message);
  }
  lines.push('', 'Reply to this email to contact the sender directly.');

  return lines.join('\n');
}

/**
 * Send a contact notification email to the site admin.
 * Never throws — failures are logged so the contact form response is unaffected.
 */
export async function sendContactNotification(data: ContactNotification): Promise<void> {
  if (!isMailerConfigured()) {
    console.warn('[mailer] SMTP not configured — skipping contact notification email.');
    return;
  }

  try {
    const mailer = getTransporter();
    await mailer.sendMail({
      from: `"Funing Website" <${SMTP_FROM}>`,
      to: CONTACT_NOTIFY_TO,
      replyTo: data.email,
      subject: `[Funing Website] ${TYPE_LABELS[data.type] || data.type} from ${data.name}`,
      text: buildEmailBody(data),
    });
    console.log('[mailer] Notification email sent to', CONTACT_NOTIFY_TO);
  } catch (error) {
    console.error('[mailer] Failed to send notification email:', error);
  }
}
