# Sunil Silai Machine

Premium multilingual product catalogue and lead-generation website for Sunil Silai Machine, Akola.

## Stack

Next.js 15, TypeScript, Tailwind CSS, Prisma/PostgreSQL, Auth.js, Cloudinary, Vitest, and Playwright.

## Local setup

1. Copy `.env.example` to `.env.local` and set values. A PostgreSQL database is required for form persistence and admin APIs.
2. Install dependencies: `npm install`.
3. Generate Prisma client: `npm run db:generate`.
4. Apply the schema: `npm run db:push`.
5. Seed the supplied catalogue: `npm run db:seed`.
6. Start development: `npm run dev`.

The website can be browsed without database credentials. Public enquiry forms open WhatsApp directly with the details entered by the visitor; they do not send notifications to a business email inbox.

## Content and media

- The application serves the supplied images from `public/images`.
- To extract embedded assets from the source Word document again, run `npm run assets:extract -- "../project details.docx"`.
- Catalogue data is centralised in `lib/business.ts`; database seed data is in `prisma/seed.ts`.
- Product prices are intentionally absent. Add a nullable `price` through protected admin APIs once a price is approved.

## Deployment

Deploy the repository to Vercel and configure all `.env.example` variables there. Provision Supabase PostgreSQL, run Prisma migrations/seed through the deployment pipeline, and configure a Cloudinary upload preset/service account. Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS domain before running the SEO checks.

## Verification

Run `npm run typecheck`, `npm run test`, `npm run build`, and then `npm run test:e2e` before release. The end-to-end suite serves the already-built production app.
