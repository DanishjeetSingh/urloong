# urloong
comically loong url for your special website!

## Running locally

The backend stores links in a free [Neon](https://neon.com) Postgres database.

1. Copy `l0o0ng/.env.example` to `l0o0ng/.env` and set `DATABASE_URL` to your Neon connection string.
2. Create the table: `npm --prefix l0o0ng run db:setup`
3. Start the backend: `npm --prefix l0o0ng start` (port 3001)
4. Start the site: `npm --prefix client run dev` and open http://localhost:3000

On Vercel, add the same `DATABASE_URL` under Project Settings > Environment Variables.
