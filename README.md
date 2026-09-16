# Job Application Tracker

Keep every application in one place — company, role, status, files, and interview rounds.

Sign in with your job-tracker API account, then filter the list, add a role, and track it through screens to offer.

**Live:** [job-application-tracker-seven-jet.vercel.app](https://job-application-tracker-seven-jet.vercel.app)

Demo login: `intern@example.com` / `Password123!`

## Setup

```bash
npm install
```

Create a `.env` file in the project root:

```
VITE_API_URL=https://your-api-host
```

Use the backend’s public URL (no trailing slash).

## Run

```bash
npm run dev
```

Opens at [http://localhost:5173](http://localhost:5173) (or the next free port Vite prints).

## How to use

1. Sign in on `/login`.
2. **Applications** — search and filter the list, or click a row to open details.
3. **New Application** — a short wizard for company, role, dates, notes, and attachments.
4. **Details** — change status, archive or delete, upload a resume/cover letter, and add interview rounds.
5. **Edit** — the same wizard, pre-filled from the existing application.

```bash
npm run build    # production build
npm run preview  # serve the build locally
```
