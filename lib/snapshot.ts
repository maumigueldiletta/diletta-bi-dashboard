// Loads snapshot JSON and expands to format expected by pages.
// Daily series are synthesized with noise+trend from real totals.

import snapshot from "@/data/snapshots/latest.json";

export type SnapshotData = typeof snapshot;
export type Period = "7d" | "30d" | "90d" | "since-launch";

export const PERIODS: { id: Period; label: string; days: number }[] = [
  { id: "7d",  label: "Últimos 7 dias",  days: 7 },
  { id: "30d", label: "Últimos 30 dias", days: 30 },
  { id: "90d", label: "Últimos 90 dias", days: 90 },
  { id: "since-launch", label: "Desde lançamento", days: 108 },
];

export const SNAPSHOT_PERIOD: Period = (snapshot.period as Period) || "30d";
export const SNAPSHOT_CAPTURED_AT = snapshot.capturedAt;

// Period scaling: snapshot is captured at one period; other periods scale linearly.
function scale(period: Period): number {
  const target = PERIODS.find(p => p.id === period)!.days;
  const source = PERIODS.find(p => p.id === SNAPSHOT_PERIOD)!.days;
  return target / source;
}

function series(days: number, base: number, noise = 0.3, trend = 0): number[] {
  const out: number[] = [];
  for (let i = 0; i < days; i++) {
    const t = i / Math.max(days - 1, 1);
    const value = base * (1 + trend * t) * (1 + (Math.random() - 0.5) * noise);
    out.push(Math.max(0, Math.round(value * 100) / 100));
  }
  return out;
}

function dates(days: number): string[] {
  const out: string[] = [];
  const end = new Date(SNAPSHOT_CAPTURED_AT || "2026-06-17T00:00:00Z");
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(end);
    d.setUTCDate(d.getUTCDate() - i);
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

// ========== GOOGLE ADS ==========
export function googleAdsData(period: Period) {
  const days = PERIODS.find(p => p.id === period)!.days;
  const ds = dates(days);
  const s = scale(period);
  const ga = snapshot.googleAds;
  const totalClicks = ga.clicks * s;
  const totalImpressions = ga.impressions * s;
  const totalSpend = ga.spend * s;
  const totalConversions = ga.conversions * s;
  const clicks = series(days, totalClicks / days, 0.4, 0.05);
  const impressions = series(days, totalImpressions / days, 0.5, 0.05);
  const spend = series(days, totalSpend / days, 0.3, 0.05);
  const conversions = series(days, totalConversions / days, 1.5, 0);
  const total = {
    clicks: Math.round(clicks.reduce((a, b) => a + b, 0)),
    impressions: Math.round(impressions.reduce((a, b) => a + b, 0)),
    spend: Math.round(spend.reduce((a, b) => a + b, 0) * 100) / 100,
    conversions: Math.round(conversions.reduce((a, b) => a + b, 0)),
  };
  return {
    ds,
    daily: ds.map((date, i) => ({ date, clicks: clicks[i], impressions: impressions[i], spend: spend[i], conversions: conversions[i] })),
    total: { ...total, ctr: total.impressions ? (total.clicks / total.impressions) * 100 : 0, cpc: total.clicks ? total.spend / total.clicks : 0 },
    campaigns: ga.campaigns.map(c => ({
      name: c.name,
      clicks: Math.round(c.clicks * s),
      spend: Math.round(c.spend * s * 100) / 100,
      conversions: Math.round(c.conversions * s),
      cpc: c.cpc,
    })),
  };
}

// ========== SEARCH CONSOLE ==========
export function gscData(period: Period) {
  const days = PERIODS.find(p => p.id === period)!.days;
  const ds = dates(days);
  const s = scale(period);
  const g = snapshot.gsc;
  const totalClicks = g.clicks * s;
  const totalImpressions = g.impressions * s;
  const clicks = series(days, totalClicks / days, 1.0, 0.3);
  const impressions = series(days, totalImpressions / days, 0.6, 0.2);
  const total = {
    clicks: Math.round(clicks.reduce((a, b) => a + b, 0)),
    impressions: Math.round(impressions.reduce((a, b) => a + b, 0)),
  };
  return {
    ds,
    daily: ds.map((date, i) => ({ date, clicks: Math.round(clicks[i]), impressions: Math.round(impressions[i]) })),
    total: { ...total, ctr: total.impressions ? (total.clicks / total.impressions) * 100 : 0, position: g.position },
    queries: g.queries.map(q => ({
      ...q,
      ctr: q.impressions ? (q.clicks / q.impressions) * 100 : 0,
    })),
  };
}

// ========== GA4 ==========
export function ga4Data(period: Period) {
  const days = PERIODS.find(p => p.id === period)!.days;
  const ds = dates(days);
  const s = scale(period);
  const g = snapshot.ga4;
  const sessions = series(days, (g.sessions * s) / days, 0.35, 0.1);
  const users = series(days, (g.users * s) / days, 0.35, 0.1);
  const generateLead = series(days, (g.generateLead * s) / days, 1.2, 0.2);
  const calendlyBook = series(days, (g.calendlyBook * s) / days, 1.5, 0.2);
  const total = {
    sessions: Math.round(sessions.reduce((a, b) => a + b, 0)),
    users: Math.round(users.reduce((a, b) => a + b, 0)),
    generateLead: Math.round(generateLead.reduce((a, b) => a + b, 0)),
    calendlyBook: Math.round(calendlyBook.reduce((a, b) => a + b, 0)),
  };
  return {
    ds,
    daily: ds.map((date, i) => ({ date, sessions: Math.round(sessions[i]), users: Math.round(users[i]), generateLead: Math.round(generateLead[i]), calendlyBook: Math.round(calendlyBook[i]) })),
    total: { ...total, engagementRate: g.engagementRate },
    channels: g.channelMix.map(c => ({
      channel: c.channel,
      sessions: Math.round((total.sessions * c.pctSessions) / 100),
      users: Math.round((total.users * c.pctSessions) / 100),
    })),
  };
}

// ========== LINKEDIN ==========
export function linkedinData(period: Period) {
  const days = PERIODS.find(p => p.id === period)!.days;
  const ds = dates(days);
  const s = scale(period);
  const l = snapshot.linkedin;
  const totalImpressions = l.impressions * s;
  const totalClicks = l.clicks * s;
  const totalSpend = l.spend * s;
  const impressions = series(days, totalImpressions / days, 0.4);
  const clicks = series(days, totalClicks / days, 0.5);
  const spend = series(days, totalSpend / days, 0.3);
  const total = {
    impressions: Math.round(impressions.reduce((a, b) => a + b, 0)),
    clicks: Math.round(clicks.reduce((a, b) => a + b, 0)),
    spend: Math.round(spend.reduce((a, b) => a + b, 0) * 100) / 100,
    leads: l.leads,
  };
  return {
    ds,
    daily: ds.map((date, i) => ({ date, impressions: Math.round(impressions[i]), clicks: Math.round(clicks[i]), spend: spend[i] })),
    total: { ...total, ctr: total.impressions ? (total.clicks / total.impressions) * 100 : 0, cpc: total.clicks ? total.spend / total.clicks : 0 },
    campaigns: l.campaigns.map(c => ({
      ...c,
      clicks: Math.round(c.clicks * s),
      impressions: Math.round(c.impressions * s),
      spend: Math.round(c.spend * s * 100) / 100,
    })),
  };
}

// ========== OVERVIEW ==========
export function overviewData(period: Period) {
  const ads = googleAdsData(period);
  const li = linkedinData(period);
  const ga = ga4Data(period);
  const totalSpend = ads.total.spend + li.total.spend;
  const totalLeads = ga.total.generateLead;
  const totalMeetings = ga.total.calendlyBook;
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

// ========== SYNC STATUS ==========
export const syncStatus = [
  { source: "Google Ads", status: "snapshot" as const, lastSyncAt: SNAPSHOT_CAPTURED_AT },
  { source: "Google Search Console", status: "snapshot" as const, lastSyncAt: SNAPSHOT_CAPTURED_AT },
  { source: "GA4", status: "snapshot" as const, lastSyncAt: SNAPSHOT_CAPTURED_AT },
  { source: "LinkedIn Ads", status: "snapshot" as const, lastSyncAt: SNAPSHOT_CAPTURED_AT },
];
