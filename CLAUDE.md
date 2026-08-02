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
  `/home`, `/digital-ecosystem`, `/media-services`, `/academy`, `/summit`,
  `/lets-work`. The prototype fakes them with client-side page state. `/` is a
  splash screen added later — logo plus a full-screen slider, no site chrome.
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

## Where the build is now
The site is built: Next.js App Router + TypeScript, vanilla CSS driven by the
handoff's tokens, Prisma/Postgres, and a schema-driven CMS at `/admin`. See
`README.md` for setup and architecture. Two things to know before editing:

- **Content is schema-driven.** `src/lib/content/defaults.ts` holds every page's
  copy and `src/lib/content/schema.ts` describes the editable fields. Saved edits
  deep-merge over the defaults, so adding a field means touching both files —
  same document id, section key and field key. There are no bespoke admin forms.
- **Uploads go straight to Vercel Blob** (`src/lib/storage.ts`), not local disk —
  Vercel's filesystem is ephemeral per-invocation, so anything written to disk
  vanishes on the next deploy. `MediaAsset.url` stores Blob's public URL as-is.
