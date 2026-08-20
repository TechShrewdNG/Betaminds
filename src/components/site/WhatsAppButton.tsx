import { Icon } from "@/components/ui/Icon";
import styles from "./WhatsAppButton.module.css";

/**
 * Floating WhatsApp launcher, bottom-right on every public page.
 *
 * A plain link, not a client component — wa.me does all the work, so there's
 * nothing here that needs JS. Renders nothing until a number is actually set,
 * so an unconfigured site never ships a dead or placeholder button.
 *
 * Uses the site's own generic phone glyph rather than WhatsApp's logo — the
 * brand-green circle plus the label is what reads as "WhatsApp" here, not a
 * redrawn trademark.
 */
export function WhatsAppButton({
  enabled,
  number,
  message,
}: {
  enabled: boolean;
  number: string;
  message: string;
}) {
  const digits = number.replace(/\D/g, "");
  if (!enabled || !digits) return null;

  const href = `https://wa.me/${digits}${
    message ? `?text=${encodeURIComponent(message)}` : ""
  }`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={styles.button}
      aria-label="Chat with us on WhatsApp"
    >
      <span className={styles.ring} aria-hidden="true" />
      <Icon name="phone" size={24} className={styles.icon} />
    </a>
  );
}
