# Schema dos snapshots

Cada snapshot é um JSON com totais atuais por canal. O loader (`lib/snapshot.ts`)
gera séries diárias derivadas (noise + trend) a partir dos totais — visualmente
realista. Histórico real fica nos commits do git: cada arquivo `YYYY-MM-DD.json`
é um snapshot daquele dia.

## `latest.json`

```json
{
  "capturedAt": "2026-06-17T18:30:00Z",
  "period": "30d",
  "googleAds": {
    "clicks": 442,
    "impressions": 7041,
    "spend": 4512.34,
    "conversions": 0,
    "campaigns": [
      { "name": "A · Squad/IA", "clicks": 287, "spend": 2481, "conversions": 0, "cpc": 8.64 }
    ]
  },
  "gsc": {
    "clicks": 38,
    "impressions": 817,
    "position": 5.4,
    "queries": [
      { "query": "diletta solutions", "clicks": 12, "impressions": 39, "position": 1.0, "isBrand": true }
    ]
  },
  "ga4": {
    "sessions": 3251,
    "users": 2842,
    "generateLead": 23,
    "calendlyBook": 5,
    "engagementRate": 56.3,
    "channelMix": [
      { "channel": "Paid Search (Google Ads)", "pctSessions": 42 }
    ]
  },
  "linkedin": {
    "clicks": 981,
    "impressions": 39364,
    "spend": 1090.0,
    "ctr": 2.49,
    "leads": 0,
    "campaigns": [
      { "name": "C1 · Awareness", "status": "Ativa", "clicks": 981, "impressions": 39364, "spend": 1090, "ctr": 2.49, "cpc": 1.11, "leads": 0 }
    ]
  }
}
```

## Workflow

1. Mauricio: comando "atualiza o dashboard"
2. Claude lê tabs de Google Ads / GA4 / GSC / LinkedIn via Chrome MCP
3. Claude escreve `data/snapshots/latest.json` + cópia em `data/snapshots/{YYYY-MM-DD}.json`
4. Commit + push → Vercel rebuilda em ~60s
5. Dashboard mostra dados reais
