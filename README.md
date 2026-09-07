# Yiğit Yetişken — Coaching Membership Platform

A membership website for a personal trainer. Clients sign up, buy a coaching package online and
reach their own panel, where they fill in their information and send their progress.

> **Status: in development.** The site is not live yet and has not been delivered.

## What it does

**Public site** — hero, package preview, transformations, testimonials, a stats bar, an FAQ and a
closing call to action, plus a floating WhatsApp button.

**Accounts** — register, log in, reset password and set a new password, all on Supabase Auth.
Google sign-in is also wired up.

**Buying a package** — the member picks a package and pays by card through **iyzico**. The payment
starts in `app/uyelik/checkout.ts` and the bank returns the user to `app/api/odeme/callback`,
which is the 3-D Secure callback step.

**Member panel** (`/panel`) — an onboarding form for the client's details, a profile form, and a
progress form.

**Admin panel** (`/admin`) — manage packages, read the analytics page, moderate testimonials, and
upload the training programs.

**Access control** — `middleware.ts` protects `/panel` and `/admin`. It reads the Supabase session
from cookies on the server before the page renders, so a protected page is never sent to a browser
without a session. If the Supabase environment variables are missing, the middleware steps aside
instead of breaking the whole site.

**SEO** — generated `sitemap.xml` and `robots.txt`, OpenGraph metadata and JSON-LD structured data.

**Legal** — the pages that Turkish distance selling rules require (`/yasal/[slug]`), served from
one dynamic route.

## Structure

```
app/
├── page.tsx              home
├── uyelik/               packages and checkout
├── giris/ kayit/         login and register
├── sifre-sifirla/ sifre-yenile/   password reset
├── panel/                member area
├── admin/                admin area
├── yasal/[slug]/         legal pages
└── api/odeme/callback/   iyzico 3-D Secure callback
components/               UI split by area: home, auth, panel, admin
supabase/migrations/      database schema
middleware.ts             route protection
```

About 5,400 lines of TypeScript and SQL.

## Built with

Next.js 15 (App Router) · React 19 · TypeScript · Supabase (Postgres, Auth, SSR) · iyzipay ·
Resend · Tailwind CSS · Framer Motion

## Running locally

```bash
npm install
cp .env.local.example .env.local   # Supabase, iyzico and Resend keys
npm run dev
```

## Still to do

Real payment credentials, final content from the trainer, and going live.
