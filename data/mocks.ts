// Compat shim — all data now comes from data/snapshots/latest.json via lib/snapshot.ts.
// Pages still import from "@/data/mocks" so we re-export everything.
export {
  PERIODS,
  SNAPSHOT_PERIOD,
  SNAPSHOT_CAPTURED_AT,
  googleAdsData,
  gscData,
  ga4Data,
  linkedinData,
  overviewData,
  syncStatus,
  type Period,
} from "@/lib/snapshot";
