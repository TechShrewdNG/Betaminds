import styles from "./WhatsAppButton.module.css";

/**
 * Floating WhatsApp launcher, bottom-right on every public page.
 *
 * A plain link, not a client component — wa.me does all the work, so there's
 * nothing here that needs JS. Renders nothing until a number is actually set,
 * so an unconfigured site never ships a dead or placeholder button.
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
      {/* The standard WhatsApp glyph — a filled speech bubble with the
          receiver-and-swirl mark, so the button reads instantly rather than
          needing the aria-label to explain what a generic phone icon means. */}
      <svg width="27" height="27" viewBox="0 0 32 32" aria-hidden="true">
        <path
          className={styles.icon}
          fill="currentColor"
          d="M16.004 3C9.096 3 3.49 8.606 3.49 15.514c0 2.474.72 4.78 1.965 6.72L3 29l6.943-2.406a12.44 12.44 0 006.061 1.554h.005c6.908 0 12.514-5.606 12.514-12.514C28.523 8.732 22.912 3 16.004 3zm0 22.86h-.004a10.35 10.35 0 01-5.28-1.447l-.379-.225-3.928 1.362 1.34-3.86-.247-.396a10.31 10.31 0 01-1.58-5.48c0-5.716 4.652-10.368 10.383-10.368 2.773 0 5.38 1.083 7.339 3.045a10.3 10.3 0 013.037 7.328c0 5.716-4.653 10.041-10.68 10.041z"
        />
        <path
          className={styles.icon}
          fill="currentColor"
          d="M21.62 18.13c-.306-.153-1.81-.893-2.09-.995-.28-.102-.484-.153-.688.153-.204.306-.79.994-.968 1.198-.178.204-.357.23-.663.077-.306-.153-1.29-.475-2.457-1.516-.908-.81-1.522-1.812-1.7-2.118-.178-.306-.019-.472.134-.624.137-.137.306-.357.459-.535.153-.179.204-.306.306-.51.102-.204.05-.383-.026-.536-.077-.153-.688-1.658-.943-2.271-.248-.596-.5-.515-.688-.524a13 13 0 00-.586-.011c-.204 0-.535.077-.815.383-.28.306-1.068 1.043-1.068 2.545 0 1.503 1.093 2.955 1.245 3.159.153.204 2.15 3.283 5.209 4.604.727.314 1.294.501 1.737.641.73.232 1.394.199 1.919.121.585-.087 1.81-.74 2.065-1.454.255-.714.255-1.325.178-1.454-.076-.128-.28-.204-.586-.357z"
        />
      </svg>
    </a>
  );
}
