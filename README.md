# Zenera Shop — Vercel Deploy

Bengali e-commerce shop built with Next.js 14 (App Router) + PostgreSQL.

## Deploy to Vercel

1. Push this folder to a GitHub repo
2. Import the repo in Vercel
3. Add a Postgres database (Vercel Postgres / Neon / Supabase — any works)
4. Set env var `DATABASE_URL` to the Postgres connection string
5. Deploy — tables + 21 products seed automatically on first request

## Local dev

```bash
npm install
# set DATABASE_URL in .env.local
npm run dev
```

## Admin

Visit `/admin` — default PIN `1234` (stored in `settings` table).

## Notes

- Product images live in `public/products/<slug>/`
- Orders are COD only; totals are calculated server-side from DB prices
- No customer registration — checkout needs name/address/mobile only
