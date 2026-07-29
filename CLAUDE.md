# Betaminds Africa website

Rebuilding the six-page Betaminds Africa marketing site from the design
reference in `design_handoff_betaminds_site/`.

## Before you start
Read `design_handoff_betaminds_site/README.md` in full. It is the spec: design
tokens, per-screen layout, interactions, state model, assets.

## Ground rules
- The `.dc.html` file is a **reference prototype on a proprietary runtime**.
  Do not try to run, port, or copy its template syntax. Read it for values.
- Each of the six pages is a **separate route** in production:
  `/`, `/digital-ecosystem`, `/media-services`, `/academy`, `/summit`,
  `/lets-work`. The prototype fakes them with client-side page state.
- The prototype's top toolbar and `device` state are preview controls.
  Do not ship them — use real CSS media queries.
- **No shadows anywhere.** Depth comes from hairline borders and surface tints.
- Accent fill `#E8A33D` always takes `#1A1206` text, never white.
- All Pexels URLs are placeholders. Keep the documented crop ratios when
  swapping in real photography.
- Copy is final. Take exact wording from the prototype; `structure.txt` has the
  long-form FAQ answers and the consultation questionnaire in full.
- `text-wrap: balance` on headings, `text-wrap: pretty` on paragraphs.
- Honour `prefers-reduced-motion`: kill the marquee and rise animations.

## Content that likely wants a CMS
Academy courses, Summit editions/galleries, portfolio entries. Everything else
can stay static.
