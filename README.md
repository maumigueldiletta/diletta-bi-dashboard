# Diletta BI · Marketing Dashboard

Painel BI consolidado de marketing da Diletta Solutions.

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS + Tremor (charts) + shadcn-style utilities
- NextAuth (Google OAuth restrito @dilettasolutions.com)
- Supabase Postgres (V1 — não implementado em V0)
- Vercel hosting + Cron Jobs (V1)

## V0 escopo

- Mock realistas baseados em dados reais (snapshot 17/jun/2026)
- 3 telas: Overview, Inbound (4 sub-tabs), Outbound (placeholders)
- Auth funcionando · sem dados reais ainda
- Deploy em dashboard.dilettasolutions.com

## Próximas versões

- V1 semana 2: APIs Google Ads + GA4 conectadas
- V1.1: Search Console + LinkedIn Ads
- V1.2: Outbound (Pipedrive + Instantly + Calendly)

## Setup local

```bash
npm install
cp .env.example .env.local
# edite .env.local com GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NEXTAUTH_SECRET
npm run dev
```

## Deploy

Push para `main` no GitHub → Vercel deploy automático.
DNS: CNAME `dashboard.dilettasolutions.com` → Vercel.

