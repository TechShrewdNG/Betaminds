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

- `public-pages.spec.ts` — every public route renders, no horizontal overflow
  at 390px, unknown routes 404, `robots.txt`/`sitemap.xml` are served.
- `brief-form.spec.ts` — the `/lets-work` project brief form: validation
  errors, values surviving a failed submit, and a successful submission.
- `admin-auth.spec.ts` — unauthenticated redirect to `/admin/login`, a wrong
  password rejected, correct credentials reaching the dashboard.

## What's not covered yet

The CMS content editor, media library upload (needs a Blob token), the
discovery questionnaire / Academy / Summit forms (CMS-defined fields, more
setup to drive generically), and the submissions inbox. Worth adding as this
suite grows, not required for it to be useful today.
