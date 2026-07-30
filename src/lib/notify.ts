import "server-only";
import { send, notifyAddresses, isConfigured } from "@/lib/email";
import { SITE_URL } from "@/lib/site";

/**
 * Composes and sends the emails triggered by a submission.
 *
 * Takes plain values rather than importing from `submissions.ts`, which imports
 * this module — keeping the dependency one-directional.
 */

type Notification = {
  id: string;
  kindLabel: string;
  /** [label, value] pairs, already in display order. */
  entries: [string, string][];
  name: string;
  email: string;
};

// ASCII on purpose: an em-dash rule turns into a wall of quoted-printable
// escapes on the wire for no visual gain in a plain-text email.
const rule = "-".repeat(46);

function body({ id, kindLabel, entries }: Notification) {
  const lines = entries
    .filter(([, value]) => value.trim() !== "")
    .map(([label, value]) => `${label}:\n  ${value.replace(/\n/g, "\n  ")}`);

  return [
    `New ${kindLabel.toLowerCase()} from the website.`,
    "",
    rule,
    "",
    lines.join("\n\n"),
    "",
    rule,
    "",
    `Open in the admin: ${SITE_URL}/admin/submissions/${id}`,
  ].join("\n");
}

/** Tells the studio a submission arrived. */
export async function notifyStudio(notification: Notification) {
  const who = notification.name || notification.email || "someone";

  return send({
    to: notifyAddresses(),
    subject: `${notification.kindLabel}: ${who}`,
    text: body(notification),
    // Replying to the notification replies to the enquirer.
    replyTo: notification.email || undefined,
  });
}

/**
 * Confirms receipt to the person who submitted.
 *
 * Off by default: sending mail on the client's behalf needs a verified sending
 * domain, or the confirmations land in spam and damage their deliverability.
 * Turn it on with EMAIL_AUTOREPLY=true once the domain is set up.
 */
export async function autoReply(notification: Notification) {
  if (process.env.EMAIL_AUTOREPLY?.trim().toLowerCase() !== "true") return;
  if (!isConfigured() || !notification.email) return;

  const greeting = notification.name ? `Hi ${notification.name},` : "Hello,";

  return send({
    to: [notification.email],
    subject: "We've got your message — Betaminds Africa",
    text: [
      greeting,
      "",
      "Thanks for getting in touch. We've received your message and someone",
      "from the team will reply within one working day.",
      "",
      "Betaminds Africa",
      SITE_URL.replace(/^https?:\/\//, ""),
    ].join("\n"),
  });
}
