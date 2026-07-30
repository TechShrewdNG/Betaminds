# Betaminds Africa — website

The Betaminds Africa marketing site, built as a Next.js app with a built-in CMS
for editing copy and photography and an inbox for form submissions.

Built from the design reference in `design_handoff_betaminds_site/`. That bundle
is the spec — read its `README.md` before changing anything visual.

## Quick start

```bash
npm install
cp .env.example .env      # then edit AUTH_SECRET and the admin credentials
npm run setup             # creates the SQLite database + first admin account
npm run dev               # http://localhost:3000
```

Sign in to the CMS at `/admin/login` with the `ADMIN_EMAIL` / `ADMIN_PASSWORD`
from your `.env`, then change the password under **Password**.

```bash
npm run build && npm start   # production
npm run typecheck            # tsc --noEmit
npm run icons                # regenerate the favicon + OG card from the logo
```

## Routes

| Route                | Page                                       |
| -------------------- | ------------------------------------------ |
| `/`                  | Homepage                                   |
| `/digital-ecosystem` | Digital Commerce & Marketplace Solutions   |
| `/media-services`    | Media Services                             |
| `/academy`           | Betaminds Academy                          |
| `/summit`            | Creative Empowerment Summit                |
| `/lets-work`         | Contact                                    |
| `/admin`             | CMS (gated by `src/middleware.ts`)         |
| `/uploads/*`         | Serves CMS-uploaded images                 |

The prototype faked these six pages with client-side page state. Here each one
is a real route, and the prototype's preview toolbar and `device` switcher are
deliberately not shipped — real CSS media queries do that job.

## How content works

There are no hand-written editor screens. One schema drives both the CMS forms
and the shape of the stored data:

```
src/lib/content/
├── defaults.ts   every page's copy, verbatim from the prototype + structure.txt
├── schema.ts     field types per section — what the admin renders
└── index.ts      reads a document and deep-merges saved edits over defaults
```

- **`defaults.ts` is the source of truth for unedited content.** On an empty
  database the site renders the full handoff copy. A `Document` row only appears
  once somebody saves an edit.
- **Saved edits are merged over the defaults**, key by key. A field nobody has
  touched keeps its handoff wording, and adding a new field later never breaks
  an existing row. Arrays replace wholesale, so deleting a repeater item really
  deletes it.
- **Adding a field means editing both `defaults.ts` and `schema.ts`** — same
  document id, same section key, same field key.

Field kinds available to `schema.ts`: `text`, `textarea`, `number`, `select`,
`image`, `images` (gallery), `list` (strings), `group`, and `repeater` (which
nests, so a footer column can hold its own list of links).

Shared content lives in one place and is read wherever it appears: engagement
plans on Digital Ecosystem also render on the homepage, media packages drive the
homepage tabs, and the Summit stat row feeds the homepage summit band.

## Forms and submissions

Five forms, all validated with Zod server-side (`src/lib/submissions.ts`), all
landing in `/admin/submissions`:

| Form                      | Where                                   |
| ------------------------- | --------------------------------------- |
| Project brief             | `/lets-work`                            |
| Discovery consultation    | `/digital-ecosystem#book` — all 8 parts |
| Academy application       | `/academy#apply`                        |
| Summit interest           | `/summit#interest`                      |
| Newsletter                | `/summit` (deduplicates by email)       |

Each has inline field errors, a pending state and a success panel. Values are
echoed back on a validation error — React 19 resets uncontrolled inputs once an
action settles, so without that the eight-part questionnaire would wipe itself.
Every form carries an off-screen honeypot field; anything submitted in it is
silently dropped.

In the inbox you can filter by type, status and free text, set a status
(new / read / replied / archived), keep internal notes, and export the current
filter to CSV.

Deep links prefill: `/lets-work?need=Brand%20identity` (the media cards and
homepage tabs use this) and `/academy?course=UI%2FUX%20Design`.

## Images

Uploads go through `/admin/media` and are written to `UPLOAD_DIR`
(`.data/uploads` by default), then served by `src/app/uploads/[...path]/route.ts`.

They are **not** in `public/` on purpose: `next start` reads that directory once
at boot, so an image uploaded after a build would 404 until a restart. A route
handler reads from disk per request, so a new upload is live immediately.

Every photograph currently on the site is a Pexels placeholder from the handoff.
Replace them by uploading the real assets and repointing each field, keeping the
documented crops: hero 16/9, about 16/10, portraits 3/4, avatars 1/1, academy
grid portrait, summit galleries square. `images.pexels.com` is allow-listed in
`next.config.ts`; add any other remote host there.

## Design rules the code enforces

From the handoff, and worth not undoing:

- **No shadows anywhere.** Depth is hairline borders and surface tints. All
  tokens live in `src/app/globals.css`.
- **Accent fill `#E8A33D` always takes `#1A1206` text**, never white.
- `text-wrap: balance` on headings, `text-wrap: pretty` on paragraphs.
- `prefers-reduced-motion` kills the marquee and the rise animation.
- Breakpoints match the prototype's measured widths: desktop > 1000px,
  tablet 640–1000px, mobile < 640px.

## SEO and launch chrome

- `sitemap.xml` lists the six routes, with `lastModified` taken from when each
  page's content was last saved in the CMS — so editing copy updates the sitemap
  without a redeploy.
- `robots.txt` allows everything except `/admin`, and points at the sitemap.
- Titles, descriptions, canonical URLs and Open Graph/Twitter cards are driven by
  each page's **Search & social** fields in the CMS. Note that Next does *not*
  merge `openGraph`/`twitter` from a parent layout, so every card field is built
  in `src/lib/seo.ts` — add fields there, not in individual pages, or they'll
  ship without an `og:image`.
- The favicon, Apple touch icon and the 1200×630 share card are generated from
  the logo by `npm run icons`. The card is composed from the logo artwork rather
  than rendered type, so no font has to be fetched at build time. Re-run it after
  replacing the logo.
- Branded 404 (with the header, footer and all six routes), an error boundary,
  and a `global-error` fallback for failures in the root layout itself.
- Set `SITE_URL` per deployment; it drives `metadataBase`, the sitemap and robots.
  On Vercel, `VERCEL_PROJECT_PRODUCTION_URL` is picked up automatically.

## Deployment notes

- **Database.** SQLite by default, so there's nothing to provision. For Postgres,
  change `provider` in `prisma/schema.prisma` and point `DATABASE_URL` at it — no
  model changes needed.
- **Uploads need a persistent writable disk.** On a platform with an ephemeral
  filesystem (Vercel's default), swap the body of `put`/`remove`/`read` in
  `src/lib/storage.ts` for a blob store; nothing else in the app sees more than
  the returned URL.
- **`AUTH_SECRET` must be set** to a long random value — it signs the admin
  session cookie.
- Public pages are statically rendered and revalidated when content is saved, so
  editing in the CMS updates the live site without a redeploy.

## Still to wire up

Called out in the handoff and left as explicit hooks rather than guesses:

- **Calendly + payment** on *Book a discovery call*. Paste the scheduling URL
  into Digital Ecosystem → Discovery questionnaire → *Calendly / scheduling URL*
  and it appears on the success screen. The booking fee itself needs a payment
  provider.
- **Sponsorship deck.** Summit → Hero → *Sponsorship deck URL*; the deck buttons
  stay hidden while it's empty.
- **Notification emails.** Submissions are stored but nobody is emailed. Add a
  send in `submit()` (`src/lib/submissions.ts`).
- **Real assets**: photography, client logos, team photos, portfolio thumbnails,
  press clippings, and an SVG logo.
- **Accent vs. logo palette.** The gold accent is a deliberate neighbour to the
  logo's orange, not a match. If brand guidelines specify the exact orange,
  it's a one-token change (`--accent-fill` in `globals.css`).
