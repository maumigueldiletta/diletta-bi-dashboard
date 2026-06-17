// Mock data realista — baseado nos números extraídos da análise real
// dos canais em 17/jun/2026. Atualizado quando APIs reais estiverem conectadas.

export type Period = "7d" | "30d" | "90d" | "since-launch";

export const PERIODS: { id: Period; label: string; days: number }[] = [
  { id: "7d",  label: "Últimos 7 dias",  days: 7 },
  { id: "30d", label: "Últimos 30 dias", days: 30 },
  { id: "90d", label: "Últimos 90 dias", days: 90 },
  { id: "since-launch", label: "Desde lançamento", days: 108 },
];

// Helper para gerar série diária com noise + trend
function series(days: number, base: number, noise = 0.3, trend = 0): number[] {
  const out: number[] = [];
  for (let i = 0; i < days; i++) {
    const t = i / Math.max(days - 1, 1);
    const value = base * (1 + trend * t) * (1 + (Math.random() - 0.5) * noise);
    out.push(Math.max(0, Math.round(value)));
  }
  return out;
}

function dates(days: number): string[] {
  const out: string[] = [];
  const end = new Date("2026-06-17T00:00:00Z");
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(end);
    d.setUTCDate(d.getUTCDate() - i);
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

// === GOOGLE ADS ===
// Real snapshot 7d: 102 clicks, R$ 1040 spend, CPC R$ 10,18, 1560 impressions
export function googleAdsData(period: Period) {
  const days = PERIODS.find((p) => p.id === period)!.days;
  const ds = dates(days);
  const clicks = series(days, 14.5, 0.4, 0.1);
  const impressions = series(days, 223, 0.5, 0.15);
  const spend = series(days, 148, 0.3, 0.05);
  const conversions = series(days, 0.4, 1.5, 0.2);
  const total = {
    clicks: clicks.reduce((a, b) => a + b, 0),
    impressions: impressions.reduce((a, b) => a + b, 0),
    spend: spend.reduce((a, b) => a + b, 0),
    conversions: conversions.reduce((a, b) => a + b, 0),
  };
  return {
    ds,
    daily: ds.map((date, i) => ({ date, clicks: clicks[i], impressions: impressions[i], spend: spend[i], conversions: conversions[i] })),
    total: { ...total, ctr: total.impressions ? (total.clicks / total.impressions) * 100 : 0, cpc: total.clicks ? total.spend / total.clicks : 0 },
    campaigns: [
      { name: "A · Squad/IA (high-intent)", clicks: Math.round(total.clicks * 0.6), spend: Math.round(total.spend * 0.55), conversions: Math.round(total.conversions * 0.7), cpc: 8.5 },
      { name: "B · Fintech vertical (core banking)", clicks: Math.round(total.clicks * 0.4), spend: Math.round(total.spend * 0.45), conversions: Math.round(total.conversions * 0.3), cpc: 12.8 },
    ],
  };
}

// === SEARCH CONSOLE ===
// Real 3m: 38 cliques, 817 impressões, CTR 4.7%, posição 5.4
export function gscData(period: Period) {
  const days = PERIODS.find((p) => p.id === period)!.days;
  const ds = dates(days);
  const clicks = series(days, 0.4, 1.5, 0.5);
  const impressions = series(days, 7.5, 0.6, 0.3);
  const total = {
    clicks: clicks.reduce((a, b) => a + b, 0),
    impressions: impressions.reduce((a, b) => a + b, 0),
  };
  return {
    ds,
    daily: ds.map((date, i) => ({ date, clicks: clicks[i], impressions: impressions[i] })),
    total: { ...total, ctr: total.impressions ? (total.clicks / total.impressions) * 100 : 0, position: 5.4 },
    queries: [
      { query: "diletta solutions", clicks: 12, impressions: 39, ctr: 30.8, position: 1.0, isBrand: true },
      { query: "diletta", clicks: 7, impressions: 79, ctr: 8.9, position: 6.7, isBrand: true },
      { query: "dilleta", clicks: 5, impressions: 22, ctr: 22.7, position: 2.7, isBrand: true },
      { query: "onda finance", clicks: 1, impressions: 1, ctr: 100, position: 1.0, isBrand: false },
      { query: "rua walter august hadler", clicks: 0, impressions: 119, ctr: 0, position: 5.6, isBrand: false },
      { query: "squad as a service", clicks: 0, impressions: 10, ctr: 0, position: 26.7, isBrand: false },
      { query: "lia core", clicks: 0, impressions: 3, ctr: 0, position: 8.7, isBrand: false },
      { query: "squad para fintechs", clicks: 0, impressions: 2, ctr: 0, position: 1.0, isBrand: false },
    ],
  };
}

// === GA4 ===
// Real 7d snapshot: ~1.000 active users, 1.600 views, 4.300 events
export function ga4Data(period: Period) {
  const days = PERIODS.find((p) => p.id === period)!.days;
  const ds = dates(days);
  const sessions = series(days, 142, 0.35, 0.2);
  const users = series(days, 110, 0.35, 0.15);
  const generateLead = series(days, 0.6, 1.2, 0.3);
  const calendlyBook = series(days, 0.3, 1.5, 0.2);
  const total = {
    sessions: sessions.reduce((a, b) => a + b, 0),
    users: users.reduce((a, b) => a + b, 0),
    generateLead: generateLead.reduce((a, b) => a + b, 0),
    calendlyBook: calendlyBook.reduce((a, b) => a + b, 0),
  };
  return {
    ds,
    daily: ds.map((date, i) => ({ date, sessions: sessions[i], users: users[i], generateLead: generateLead[i], calendlyBook: calendlyBook[i] })),
    total: { ...total, engagementRate: 56.3 },
    channels: [
      { channel: "Paid Search (Google Ads)", sessions: Math.round(total.sessions * 0.42), users: Math.round(total.users * 0.45) },
      { channel: "Direct", sessions: Math.round(total.sessions * 0.22), users: Math.round(total.users * 0.21) },
      { channel: "Paid Social (LinkedIn)", sessions: Math.round(total.sessions * 0.18), users: Math.round(total.users * 0.17) },
      { channel: "Organic Search", sessions: Math.round(total.sessions * 0.10), users: Math.round(total.users * 0.10) },
      { channel: "Referral", sessions: Math.round(total.sessions * 0.05), users: Math.round(total.users * 0.04) },
      { channel: "Organic Social", sessions: Math.round(total.sessions * 0.03), users: Math.round(total.users * 0.03) },
    ],
  };
}

// === LINKEDIN ADS ===
// Real since-launch: 981 clicks, 39.364 impressões, R$ 1.090 spend, CTR 2.49%
export function linkedinData(period: Period) {
  const days = PERIODS.find((p) => p.id === period)!.days;
  const ds = dates(days);
  // Scale conforme since-launch (108 dias)
  const scaleSinceLaunch = days / 108;
  const totalImpressions = Math.round(39364 * scaleSinceLaunch);
  const totalClicks = Math.round(981 * scaleSinceLaunch);
  const totalSpend = Math.round(1090 * scaleSinceLaunch);
  const impressions = series(days, totalImpressions / days, 0.4);
  const clicks = series(days, totalClicks / days, 0.5);
  const spend = series(days, totalSpend / days, 0.3);
  const total = {
    impressions: impressions.reduce((a, b) => a + b, 0),
    clicks: clicks.reduce((a, b) => a + b, 0),
    spend: spend.reduce((a, b) => a + b, 0),
    leads: 0,
  };
  return {
    ds,
    daily: ds.map((date, i) => ({ date, impressions: impressions[i], clicks: clicks[i], spend: spend[i] })),
    total: { ...total, ctr: total.impressions ? (total.clicks / total.impressions) * 100 : 0, cpc: total.clicks ? total.spend / total.clicks : 0 },
    campaigns: [
      { name: "C1 · Awareness — Diletta posicionamento", status: "Ativa", clicks: total.clicks, impressions: total.impressions, spend: total.spend, ctr: 2.49, cpc: total.clicks ? total.spend / total.clicks : 0, leads: 0 },
      { name: "C2 · Lead Gen — Diagnóstico arquitetura", status: "Rascunho", clicks: 0, impressions: 0, spend: 0, ctr: 0, cpc: 0, leads: 0 },
    ],
  };
}

// === OVERVIEW CONSOLIDATED ===
export function overviewData(period: Period) {
  const ads = googleAdsData(period);
  const li = linkedinData(period);
  const ga = ga4Data(period);
  const totalSpend = ads.total.spend + li.total.spend;
  const totalLeads = Math.round(ga.total.generateLead);
  const totalMeetings = Math.round(ga.total.calendlyBook);
  return {
    totalSpend,
    totalLeads,
    cpl: totalLeads ? totalSpend / totalLeads : 0,
    totalMeetings,
    ds: ads.ds,
    spendByChannel: ads.ds.map((date, i) => ({
      date,
      "Google Ads": ads.daily[i].spend,
      "LinkedIn Ads": li.daily[i].spend,
    })),
    leadsByChannel: ga.ds.map((date, i) => ({
      date,
      "Inbound (web)": ga.daily[i].generateLead,
      "LinkedIn Lead Gen": 0,
    })),
  };
}

// === SYNC STATUS (mock) ===
export const syncStatus = [
  { source: "Google Ads", status: "mock" as const, lastSyncAt: "2026-06-17T17:30:00Z" },
  { source: "Google Search Console", status: "mock" as const, lastSyncAt: "2026-06-17T17:30:00Z" },
  { source: "GA4", status: "mock" as const, lastSyncAt: "2026-06-17T17:30:00Z" },
  { source: "LinkedIn Ads", status: "mock" as const, lastSyncAt: "2026-06-17T17:30:00Z" },
];
