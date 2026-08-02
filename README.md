# Betaminds Africa — website

The Betaminds Africa marketing site, built as a Next.js app with a built-in CMS
for editing copy and photography and an inbox for form submissions.

Built from the design reference in `design_handoff_betaminds_site/`. That bundle
is the spec — read its `README.md` before changing anything visual.

## Quick start

```bash
npm install
cp .env.example .env      # then edit DATABASE_URL, AUTH_SECRET and the admin credentials
npm run setup             # creates the database tables + first admin account
npm run dev               # http://localhost:3000
```

Needs a Postgres database — see [Deployment notes](#deployment-notes) for why.
A free [Neon](https://neon.tech) or [Supabase](https://supabase.com) project
works for local development; point `DATABASE_URL` at it.

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
| `/portfolio`         | Case-study index                           |
| `/portfolio/[slug]`  | One case study, pre-rendered per project   |
| `/lets-work`         | Contact                                    |
| `/admin`             | CMS (gated by `src/middleware.ts`)         |

The prototype faked its six pages with client-side page state. Here each one is a
real route, and the prototype's preview toolbar and `device` switcher are
deliberately not shipped — real CSS media queries do that job. `/portfolio` is an
addition: the brief asked for a "View project" CTA, which needs somewhere to go.

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

Field kinds available to `schema.ts`: `text`, `textarea`, `number`, `boolean`,
`select`, `image`, `video`, `images` (gallery), `list` (strings), `group`, and
`repeater` (which nests, so a footer column can hold its own list of links).

One gotcha: a section key must not match a field key inside it. The editor reads
`doc[sectionKey][fieldKey]`, so a section called `items` holding a field called
`items` would look for `doc.items.items` and silently render an empty list.

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

**The discovery questionnaire, Academy application and Summit interest form have
CMS-defined fields.** Label, type, dropdown options, required-ness and width are
all content (`src/lib/forms/definition.ts`), so the studio can rename a question,
add an option or add a whole field without a developer. One renderer
(`DynamicForm.tsx`) draws them and `lib/forms/validate.ts` builds the Zod schema
from the same definitions, resolved once in `lib/forms/resolve.ts` — so rendering
and validation can never disagree. Options that come from elsewhere (Academy
courses, learning formats, engagement plans) are injected there rather than typed
twice. The `key` is what answers are stored under: renaming a label is free,
changing a key orphans answers already collected.

Each form has inline field errors, a pending state and a success panel. Two
React 19 behaviours are worked around in `Field.tsx`, both of which silently ate
input before being fixed:

- React resets the form once its action settles, and only re-writes a `value`
  prop that *changed* — so a controlled `<select>` kept the browser's reset value.
  A small effect re-asserts it.
- A `<select>` whose only selected option is `disabled` has no selection at all,
  so the browser omits it from the submission entirely. The placeholder option
  stays selectable and emptiness is rejected server-side instead.

Every form carries an off-screen honeypot field; anything submitted in it is
silently dropped.

In the inbox you can filter by type, status and free text, set a status
(new / read / replied / archived), keep internal notes, and export the current
filter to CSV. Field labels there come from the live form definitions, so
renaming a question renames it in the inbox and the CSV too; answers stored under
a key that no longer exists still show, under a humanised version of the key.

**Notification email.** Every submission emails `NOTIFY_EMAILS`, with `Reply-To`
set to the enquirer and a deep link to the admin record. Transport is Resend
(over REST, no SDK) or any SMTP server, picked up from whichever credentials are
present; with none set the intended mail is logged instead and the dashboard says
so plainly. Sending is best-effort and deliberately cannot fail a submission — a
provider outage logs and moves on. An optional confirmation to the sender is off
by default (`EMAIL_AUTOREPLY`), because it needs a verified sending domain or it
lands in spam.

Deep links prefill: `/lets-work?need=Brand%20identity` (the media cards and
homepage tabs use this) and `/academy?course=UI%2FUX%20Design`.

## Portfolio

Projects live in the **Portfolio** document. Each entry has a slug, a thumbnail
and hero, challenge/approach/outcome narrative, an optional results row, gallery
and client quote, plus a **Published** tick so a case study can be written before
it goes live. `/portfolio/[slug]` is pre-rendered per published project, and the
homepage grid, the portfolio index and the sitemap all read the same list.

The six seeded projects carry the prototype's names and placeholder photography
with **structural** narrative copy. `results` is deliberately empty: inventing
performance figures for a client's case study would put fabricated claims on a
live marketing site. Fill those in with numbers the client will stand behind.

## Opening slider

The homepage opens on a full-screen slider, edited under **Home → Opening
slider**. Each slide carries its own background video, background picture,
headline, body and up to two buttons; the section also holds the autoplay
toggle and seconds-per-slide.

- **Video is optional per slide.** A slide with no video falls back to its
  picture, so always set a picture — it's also the poster while the video
  loads, and what visitors on data-saver or reduced-motion settings get.
- **Switching the slider off** falls back to the static **Hero** section below
  it, so the homepage always has an opening screen.
- Autoplay never runs for visitors who ask their device to reduce motion, and
  the background video doesn't play for them either — a looping background is
  exactly the movement that setting is asking us to stop.
- Only the first slide's headline is the page's `<h1>`; the rest are styled
  paragraphs, so the homepage keeps a single, stable main heading.

The slider fills the viewport minus the sticky header, via the `--header-h`
token in `globals.css`. If you change the header's height, change that token
too or the slider's controls drift off the bottom of the screen.

## Images

Uploads go through `/admin/media` and are stored in Vercel Blob
(`src/lib/storage.ts`), not local disk — Vercel's filesystem is ephemeral per
invocation, so anything written to disk vanishes on the next deploy or even the
next request. `MediaAsset.url` stores Blob's public URL as-is; nothing else in
the app knows storage is Blob rather than anything else.

Needs a Blob store connected to the project: dashboard → project → **Storage**
→ **Create Database** → **Blob** — it injects `BLOB_READ_WRITE_TOKEN` the same
way the Postgres integration injects `DATABASE_URL`. Redeploy after adding it.

The library takes video as well as stills (MP4, WebM, OGG, MOV, up to 64 MB),
for the opening slider's backgrounds. Anything longer than a few seconds of
compressed footage belongs on a CDN with its URL pasted in instead.

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

- **Database is Postgres, not SQLite, and that's not optional on Vercel.**
  Serverless functions have no persistent disk shared between invocations —
  point two requests at "the same" SQLite `file:` path and they can each see a
  different (or missing) database. Set `DATABASE_URL` to a real Postgres
  connection string. Easiest on Vercel: dashboard → project → **Storage** →
  **Create Database** → Postgres (Neon) — it injects the connection env vars
  for you. After adding it (or changing any env var), **redeploy** — Vercel
  only picks up new environment variables on the next build.
- **First deploy needs the schema pushed and an admin seeded**, neither of
  which happens automatically in Vercel's build (`prisma generate && next build`
  only generates the client). Point `DATABASE_URL` at the same database
  locally and run `npm run setup` once — it creates the tables and the first
  admin account. Re-run just `npm run db:seed` any time to add another admin.
- **Uploads use Vercel Blob**, for the same reason the database can't be
  SQLite — see [Images](#images) above. Needs a Blob store connected via the
  **Storage** tab, same as Postgres.
- **`AUTH_SECRET` must be set** to a long random value — it signs the admin
  session cookie. Without it, admin login silently fails (middleware treats a
  missing secret as "not authenticated," not an error).
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
- **Real assets**: photography, client logos, team photos and names, press
  clippings, real case-study copy and figures, and an SVG logo.
- **Accent vs. logo palette.** The gold accent is a deliberate neighbour to the
  logo's orange, not a match. If brand guidelines specify the exact orange,
  it's a one-token change (`--accent-fill` in `globals.css`).

Known gaps, in the order worth closing:

1. **Rate limiting.** The honeypot catches naive bots and nothing else.
2. **Responsive images.** Every `<img>` serves one size to every viewport — an
   1800px hero goes to a 390px phone. `sharp` is already a dependency, so
   variants could be generated on upload and emitted as `srcset`.
3. **One admin account, no reset.** The account is seeded from `.env`; there is
   no UI to add a colleague and no password recovery.
4. **No draft/preview for page content.** Saving is immediately live, with no
   version history to roll back to. (Portfolio projects do have a Published
   tick.)
5. **Blog and Talent Hub.** `structure.txt` lists both in the Academy nav; the
   prototype dropped them. Everything needed to add them exists.

## Testing

Playwright, driving a real browser against a production build (`next build &&
next start`) rather than `next dev` — see `tests/README.md` for what's covered
and what isn't. Run it with:

```bash
npm run setup   # once: schema + seeded admin, against DATABASE_URL
npm test
```

CI runs the same suite on every push and pull request
(`.github/workflows/test.yml`), against a Postgres service container.

The suite covers the public routes, the project brief form's validation round
trip, and admin auth. Plenty is still verified only by hand — the CMS content
editor, media uploads, the three CMS-defined forms, the inbox and CSV export,
and notification email. Those are the obvious next additions.
