# End-to-end tests

Playwright, run against a production build (`next build && next start`), not
`next dev` — that's how this app has actually been verified all along, and a
dev-server-only pass has missed real issues before.

## Running locally

Needs a real Postgres reachable at `DATABASE_URL`, with the schema pushed and
an admin seeded:

```bash
npm run setup   # prisma db push && db:seed — reads DATABASE_URL, ADMIN_EMAIL,
                 # ADMIN_PASSWORD from .env
npm test
```

The admin-auth tests skip themselves if `ADMIN_EMAIL`/`ADMIN_PASSWORD` aren't
set in the environment `npm test` runs in.

## What's covered

- `public-pages.spec.ts` — every content page renders with exactly one visible
  `h1`, no horizontal overflow at 390px, unknown routes 404, and
  `robots.txt`/`sitemap.xml` are served.
- `brief-form.spec.ts` — the `/lets-work` project brief form: validation
  errors, values surviving a failed submit, and a successful submission.
- `admin-auth.spec.ts` — unauthenticated redirect to `/admin/login`, a wrong
  password rejected, correct credentials reaching the dashboard.
- `admin-mobile.spec.ts` — the CMS at 390px: the nav sits behind a hamburger,
  the toggle stays reachable over the open drawer and closes it, choosing a
  page dismisses it, no admin page overflows sideways, and the sidebar is
  simply present on desktop with no hamburger.
- `hero-slider.spec.ts` — the splash screen at `/`: it fills the viewport with
  its controls in view and no site chrome, the logo sits top right and leads to
  `/home`, one slide shows at a time, the arrows move between them, inactive
  slides are out of the tab order, and autoplay stops for
  `prefers-reduced-motion`.

## What's not covered yet

The CMS content editor, media library upload (needs a deployment: uploads authenticate via OIDC), the
discovery questionnaire / Academy / Summit forms (CMS-defined fields, more
setup to drive generically), and the submissions inbox. Worth adding as this
suite grows, not required for it to be useful today.
