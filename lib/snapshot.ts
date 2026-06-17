// Loads snapshot JSON. Returns null for unverified fields.
// Daily series are evenly-distributed (no noise) from real totals.
import snapshot from "@/data/snapshots/latest.json";

export type Period = "7d" | "30d" | "90d" | "since-launch";

export const PERIODS: { id: Period; label: string; days: number }[] = [
  { id: "7d",  label: "Últimos 7 dias",  days: 7 },
  { id: "30d", label: "Últimos 30 dias", days: 30 },
  { id: "90d", label: "Últimos 90 dias", days: 90 },
  { id: "since-launch", label: "Desde lançamento", days: 108 },
];

export const SNAPSHOT_CAPTURED_AT = snapshot.capturedAt;

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

// Even distribution — no noise, no fake trend.
function flatSeries(days: number, total: number | null): number[] {
  if (total === null || total === undefined) return new Array(days).fill(0);
  const perDay = total / days;
  return new Array(days).fill(perDay);
}

function nz(v: number | null | undefined, fallback = 0): number {
  return v === null || v === undefined ? fallback : v;
}

// ========== GOOGLE ADS ==========
export function googleAdsData(period: Period) {
  const days = PERIODS.find(p => p.id === period)!.days;
  const ds = dates(days);
  const ga = snapshot.googleAds;
  const clicks = flatSeries(days, ga.clicks);
  const impressions = flatSeries(days, ga.impressions);
  const spend = flatSeries(days, ga.spend);
  const conversions = flatSeries(days, ga.conversions);
  return {
    ds,
    verified: true,
    period: ga.period,
    daily: ds.map((date, i) => ({
      date, clicks: clicks[i], impressions: impressions[i], spend: spend[i], conversions: conversions[i],
    })),
    total: {
      clicks: ga.clicks, impressions: ga.impressions, spend: ga.spend, conversions: ga.conversions,
      ctr: ga.ctr, cpc: ga.cpc, convRate: ga.convRate, costPerConv: ga.costPerConv,
    },
    campaigns: ga.campaigns,
  };
}

// ========== SEARCH CONSOLE ==========
export function gscData(period: Period) {
  const days = PERIODS.find(p => p.id === period)!.days;
  const ds = dates(days);
  const g = snapshot.gsc;
  const clicks = flatSeries(days, g.clicks);
  const impressions = flatSeries(days, g.impressions);
  return {
    ds,
    verified: true,
    period: g.period,
    daily: ds.map((date, i) => ({ date, clicks: clicks[i], impressions: impressions[i] })),
    total: {
      clicks: g.clicks, impressions: g.impressions, ctr: g.ctr, position: g.position,
    },
    queries: g.queries,
  };
}

// ========== GA4 ==========
export function ga4Data(period: Period) {
  const days = PERIODS.find(p => p.id === period)!.days;
  const ds = dates(days);
  const g = snapshot.ga4;
  // Scale 7d KPIs to the requested period (rough estimate, marked clearly)
  const scale = days / 7;
  const usersScaled = Math.round(g.users7d * scale);
  const viewsScaled = Math.round(g.views7d * scale);
  const eventsScaled = Math.round(g.events7d * scale);
  return {
    ds,
    verified: true,
    period: g.period,
    snapshot7d: { users: g.users7d, views: g.views7d, events: g.events7d, vsPrev: g.vsPrevPct },
    scaledForPeriod: { users: usersScaled, views: viewsScaled, events: eventsScaled },
    daily: ds.map((date, i) => ({
      date,
      sessions: 0,
      users: usersScaled / days,
      generateLead: 0,
      calendlyBook: 0,
    })),
    total: {
      // Unverified values stay null — pages will render "—"
      sessions: g.sessions,
      users: usersScaled,
      generateLead: g.generateLead,
      calendlyBook: g.calendlyBook,
      engagementRate: g.engagementRate,
    },
    channels: g.channelMix, // null
  };
}

// ========== LINKEDIN ==========
export function linkedinData(period: Period) {
  const days = PERIODS.find(p => p.id === period)!.days;
  const ds = dates(days);
  const l = snapshot.linkedin;
  const clicks = flatSeries(days, l.totalClicks);
  const spend = flatSeries(days, l.totalSpendUsd); // USD
  return {
    ds,
    verified: true,
    period: l.period,
    daily: ds.map((date, i) => ({
      date,
      impressions: 0,
      clicks: clicks[i],
      spend: spend[i],
    })),
    total: {
      impressions: l.totalImpressions, // null
      clicks: l.totalClicks,
      spend: l.totalSpendUsd, // USD
      currency: "USD",
      ctr: l.totalCtr, // null
      cpc: l.totalClicks ? l.totalSpendUsd / l.totalClicks : null,
      leads: 0,
    },
    campaigns: l.campaigns,
  };
}

// ========== OVERVIEW ==========
export function overviewData(period: Period) {
  const ads = googleAdsData(period);
  const li = linkedinData(period);
  const ga = ga4Data(period);
  return {
    // Only Google Ads BRL is summed. LinkedIn USD shown separately.
    totalSpendBrl: ads.total.spend,
    totalSpendUsd: li.total.spend,
    totalLeads: ga.total.generateLead, // null
    cpl: null, // unknown without verified leads
    totalMeetings: ga.total.calendlyBook, // null
    ds: ads.ds,
    spendByChannel: ads.ds.map((date, i) => ({
      date,
      "Google Ads (BRL)": ads.daily[i].spend,
    })),
    leadsByChannel: null, // suppress chart until verified
  };
}

// ========== SYNC STATUS ==========
export const syncStatus = [
  { source: "Google Ads", status: "snapshot" as const, lastSyncAt: SNAPSHOT_CAPTURED_AT },
  { source: "Google Search Console", status: "snapshot" as const, lastSyncAt: SNAPSHOT_CAPTURED_AT },
  { source: "GA4 (parcial)", status: "snapshot" as const, lastSyncAt: SNAPSHOT_CAPTURED_AT },
  { source: "LinkedIn Ads (parcial)", status: "snapshot" as const, lastSyncAt: SNAPSHOT_CAPTURED_AT },
];

export const SNAPSHOT_PERIOD = "30d" as Period;
