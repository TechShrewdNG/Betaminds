/**
 * Turns a contact row's value into something you can actually act on.
 *
 * The contact block is CMS content — an editor types "hello@betaminds.africa"
 * or "+234 801 234 5678", not a URL — so the rows rendered as dead text on the
 * one page whose whole job is getting in touch. On a phone that means copying a
 * number out by hand. The shape of the value tells us what it is.
 *
 * Returns null for anything that isn't actionable (a street address), which the
 * caller renders as plain text.
 */
export function contactHref(value: string): string | null {
  const text = value.trim();
  if (text === "") return null;

  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) return `mailto:${text}`;

  // Phone: digits with the usual separators, and enough of them to be a number
  // rather than a year or a house number.
  if (/^\+?[\d\s()./-]+$/.test(text)) {
    const digits = text.replace(/[^\d]/g, "");
    if (digits.length >= 7) {
      return `tel:${text.startsWith("+") ? "+" : ""}${digits}`;
    }
  }

  if (/^https?:\/\//i.test(text)) return text;

  // A bare domain — "betaminds.africa". Needs a scheme or the browser reads it
  // as a relative path and lands on a 404.
  if (/^[\w-]+(\.[\w-]+)+(\/\S*)?$/.test(text) && !text.includes(" ")) {
    return `https://${text}`;
  }

  return null;
}

/**
 * Drops links still sitting on their seeded placeholder href.
 *
 * Social handles and legal pages ship as "#" until someone fills them in.
 * Mirrors how the floating WhatsApp button stays off the live site until a real
 * number is entered: a link that goes nowhere is worse than no link.
 */
export function withDestination<T extends { href: string }>(links: T[]): T[] {
  return links.filter((link) => {
    const href = link.href.trim();
    return href !== "" && href !== "#";
  });
}
