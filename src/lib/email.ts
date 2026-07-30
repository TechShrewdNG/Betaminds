import "server-only";

/**
 * Outbound email.
 *
 * Deliberately provider-agnostic and deliberately optional: with nothing
 * configured the transport logs and returns, so a fresh checkout works and
 * submissions are never blocked on mail delivery. Pick a transport by setting
 * env vars — see .env.example.
 *
 *   EMAIL_TRANSPORT=resend  + RESEND_API_KEY
 *   EMAIL_TRANSPORT=smtp    + SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS
 *   EMAIL_TRANSPORT=none    (default)
 */

export type Mail = {
  to: string[];
  subject: string;
  text: string;
  replyTo?: string;
};

export type SendResult =
  | { ok: true; transport: string }
  | { ok: false; transport: string; error: string };

function transportName(): "resend" | "smtp" | "none" {
  const explicit = process.env.EMAIL_TRANSPORT?.trim().toLowerCase();
  if (explicit === "resend" || explicit === "smtp" || explicit === "none") {
    return explicit;
  }
  // Infer from whatever credentials are present, so setting a key is enough.
  if (process.env.RESEND_API_KEY) return "resend";
  if (process.env.SMTP_HOST) return "smtp";
  return "none";
}

function fromAddress() {
  return (
    process.env.EMAIL_FROM?.trim() || "Betaminds Africa <hello@betaminds.africa>"
  );
}

/** Who gets told about a new submission. Falls back to the from address. */
export function notifyAddresses(): string[] {
  const raw = process.env.NOTIFY_EMAILS?.trim();
  if (!raw) {
    const match = fromAddress().match(/<([^>]+)>/);
    return match ? [match[1]] : [fromAddress()];
  }
  return raw
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean);
}

export function isConfigured() {
  return transportName() !== "none";
}

export function describeTransport() {
  const name = transportName();
  if (name === "none") return "not configured";
  return `${name} → ${notifyAddresses().join(", ")}`;
}

async function sendViaResend(mail: Mail): Promise<SendResult> {
  // Called over REST rather than through the SDK, to avoid another dependency.
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromAddress(),
      to: mail.to,
      subject: mail.subject,
      text: mail.text,
      ...(mail.replyTo ? { reply_to: mail.replyTo } : {}),
    }),
  });

  if (!response.ok) {
    return {
      ok: false,
      transport: "resend",
      error: `${response.status} ${await response.text()}`.slice(0, 300),
    };
  }
  return { ok: true, transport: "resend" };
}

async function sendViaSmtp(mail: Mail): Promise<SendResult> {
  // Imported lazily so the dependency is only loaded when SMTP is in use.
  const { createTransport } = await import("nodemailer");

  const port = Number(process.env.SMTP_PORT ?? 587);
  const transporter = createTransport({
    host: process.env.SMTP_HOST,
    port,
    // 465 is implicit TLS; 587 upgrades with STARTTLS.
    secure: port === 465,
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASS
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
  });

  await transporter.sendMail({
    from: fromAddress(),
    to: mail.to,
    subject: mail.subject,
    text: mail.text,
    replyTo: mail.replyTo,
  });

  return { ok: true, transport: "smtp" };
}

/**
 * Send one message.
 *
 * Never throws — callers are handling a visitor's form submission, and a mail
 * outage must not turn into a failed enquiry. Failures are logged and returned.
 */
export async function send(mail: Mail): Promise<SendResult> {
  const transport = transportName();

  if (mail.to.length === 0) {
    return { ok: false, transport, error: "No recipients." };
  }

  if (transport === "none") {
    console.info(
      `[email] not configured — would have sent "${mail.subject}" to ${mail.to.join(", ")}`,
    );
    return { ok: true, transport: "none" };
  }

  try {
    return transport === "resend"
      ? await sendViaResend(mail)
      : await sendViaSmtp(mail);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[email] send failed via ${transport}:`, message);
    return { ok: false, transport, error: message.slice(0, 300) };
  }
}
