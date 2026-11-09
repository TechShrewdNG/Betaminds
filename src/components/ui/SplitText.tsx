import { Fragment } from "react";

/**
 * A heading whose words arrive one after another instead of as one slab.
 *
 * The display type is the site's main asset and it was the one thing that
 * never moved — sections faded in as a block, headings included. Splitting
 * into words lets the reveal read as typesetting rather than a panel fading up.
 *
 * Deliberately built on the existing stagger: the words are direct children of
 * a `[data-stagger]` element, so ScrollReveal tags them with `.bm-stagger` and
 * a per-child `--bm-delay` exactly as it does grid cards. That means one timing
 * curve across the site, and the reduced-motion and no-JS behaviour is whatever
 * the rest of the reveal system already does — words simply render as text.
 *
 * The delay is capped at the seventh child upstream, which suits headings: a
 * long one finishes rather than trailing a word in after the reader has moved
 * on.
 */
export function SplitText({ text }: { text: string }) {
  // Collapse runs of whitespace so a stray newline in CMS copy can't produce
  // an empty word span that would take up a stagger slot and delay the rest.
  const words = text.trim().split(/\s+/).filter(Boolean);

  return (
    <span data-stagger>
      {words.map((word, index) => (
        // The space is a sibling text node, never a child of the span. A
        // trailing space inside an inline-block is trimmed, which ran every
        // word of the heading together — and it does not show up in
        // textContent, only on screen.
        //
        // The fragment adds no DOM node, so the words stay the only element
        // children here and the stagger indices upstream still line up.
        <Fragment key={`${word}-${index}`}>
          <span className="bm-word">{word}</span>
          {index < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </span>
  );
}
