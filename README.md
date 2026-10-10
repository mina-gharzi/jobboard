# Jabino — Job Board

A full-stack job board with separate **candidate** and **employer** roles: post and manage jobs, search and filter them, apply with a PDF resume, and track every application through to a decision. Persian-first (RTL) interface.

**[Live demo](https://jobboard-6p9y.vercel.app/)**

![Jabino screenshot](docs/screenshot.png)

**Built with:** Next.js 16 · TypeScript · Prisma · PostgreSQL (Neon) · Better Auth · Zod · Tailwind CSS · Vercel Blob · Resend · Vitest · Playwright

## What it does

**Candidates**
- Browse, search, filter, sort and paginate jobs (search handles Persian character variants)
- Apply with a cover letter and an optional PDF resume
- Save jobs, track application status, and withdraw an application before a decision is made
- Keep a profile with phone, bio and resume

**Employers**
- Post, edit, close or delete jobs (draft, published, closed)
- Review applicants per job and move each application through pending, reviewed, accepted or rejected
- Maintain a company profile with logo, description, website and team size

**Platform**
- Email and password auth with password reset by email
- SEO basics: sitemap, robots, page metadata and JSON-LD structured data for jobs
- Per-route loading and error states, privacy policy and terms pages

## Key engineering decisions

**Every server action checks role and ownership.** Before touching data, an action reads the session, verifies the role, then verifies the resource belongs to that user (for example, an employer can only change the status of applications on their own jobs). The UI hides controls, but the server is the real gatekeeper.

**Roles are controlled on the server.** Better Auth lets clients send extra user fields, so sign-up coerces any unknown role to `CANDIDATE` and role changes through the auth API are rejected. The column is a Prisma enum, so the database also refuses invalid values.

**Resume uploads are validated and cleaned up.** Files must be real PDFs (the `%PDF-` header is checked, not just the extension), are limited to 5 MB, and get a cryptographically random name. Files are deleted from Vercel Blob when an application is withdrawn or its job is deleted.

**Concurrency is handled in the database.** `(job, candidate)` is unique, and a duplicate submission from a double click is caught via the unique-constraint error and reported correctly instead of failing silently.

**Auth endpoints are rate limited.** Sign-in, sign-up and password-reset have stricter limits than the global default.

**The E2E cleanup endpoint is locked down.** It only works when rate limiting is explicitly disabled for tests, only deletes `@e2e.test` accounts, and is never available on Vercel production.

## Testing

| Layer | Tooling | Command |
| --- | --- | --- |
| Unit | Vitest: validation, search, filters, formatting, roles, resume upload | `npx vitest run` |
| End-to-end | Playwright: register as employer and candidate, post jobs, apply with a PDF, save and withdraw, change application status | `npx playwright test` |

E2E tests create and delete data, so run them against a **separate database** (for example a Neon branch), never your production one.

## Known limitations

- **Rate limiting is in-memory.** On a serverless host it is not shared between instances. A shared store (for example Redis) is the next step.
- **Email verification is not required** at sign-up.
- **Resume files are public by link.** Names are unguessable and links are only shown to the candidate and the employer of that job, but anyone holding a link can open it. This is stated in the privacy policy.
- **No self-service account deletion** yet; the privacy policy points users to support.

## Getting started

Requirements: Node.js 20+ and a PostgreSQL database.

```bash
git clone https://github.com/mina-gharzi/jobboard.git
cd jobboard
npm install        # also runs prisma generate
```

Create `.env`:

```
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=a-long-random-string
NEXT_PUBLIC_APP_URL=http://localhost:3000
BLOB_READ_WRITE_TOKEN=...          # resume uploads (Vercel Blob)
RESEND_API_KEY=...                 # optional; without it, reset links are printed to the console
RESEND_FROM_EMAIL=...              # optional
```

```bash
npx prisma migrate deploy
npm run dev        # http://localhost:3000
```

## Project structure

```
src/app/        routes: jobs, employer, candidate, auth pages, privacy, terms, api
src/components/ shared UI and home page sections
src/lib/        server actions, auth, validation (Zod), search, resume and storage helpers
prisma/         schema and migrations
e2e/            Playwright tests
```

## License

MIT © Mina Gharzi