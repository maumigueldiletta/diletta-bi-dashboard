"use client";
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { KpiCard } from "@/components/KpiCard";
import { DataTable } from "@/components/DataTable";
import { LineChartCard } from "@/components/charts/LineChartCard";
import { brl, num, pct } from "@/lib/utils";
import { googleAdsData, gscData, ga4Data, linkedinData, Period } from "@/data/mocks";
import { cn } from "@/lib/utils";

type Tab = "google-ads" | "gsc" | "ga4" | "linkedin-ads";

const TABS: { id: Tab; label: string }[] = [
  { id: "google-ads", label: "Google Ads" },
  { id: "gsc", label: "Search Console" },
  { id: "ga4", label: "Google Analytics 4" },
  { id: "linkedin-ads", label: "LinkedIn Ads" },
];

export default function InboundPage() {
  const [period, setPeriod] = useState<Period>("30d");
  const [tab, setTab] = useState<Tab>("google-ads");

  return (
    <div className="brand-grid min-h-screen">
      <Sidebar />
      <div className="ml-64">
        <Topbar period={period} onChange={setPeriod} title="Inbound" subtitle="Tráfego e leads de canais de aquisição inbound." />

        {/* Tab bar */}
        <div className="border-b border-diletta-line bg-diletta-bg2 px-8">
          <div className="flex gap-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "border-b-2 px-4 py-3 text-sm font-medium transition",
                  tab === t.id
                    ? "border-diletta-red text-diletta-text1"
                    : "border-transparent text-diletta-text3 hover:text-diletta-text1"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6 px-8 py-8">
          {tab === "google-ads" && <GoogleAdsTab period={period} />}
          {tab === "gsc" && <GscTab period={period} />}
          {tab === "ga4" && <Ga4Tab period={period} />}
          {tab === "linkedin-ads" && <LinkedinTab period={period} />}
        </div>
      </div>
    </div>
  );
}

function GoogleAdsTab({ period }: { period: Period }) {
  const d = googleAdsData(period);
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Investimento" value={brl(d.total.spend)} delta={15.2} />
        <KpiCard label="Cliques" value={num(d.total.clicks)} delta={8.7} />
        <KpiCard label="CPC médio" value={brl(d.total.cpc)} delta={6.4} accent={d.total.cpc > 9 ? "red" : "default"} highlight={d.total.cpc > 9} />
        <KpiCard label="CTR" value={pct(d.total.ctr, 2)} delta={1.8} />
      </div>
      <LineChartCard
        title="Cliques e investimento — diário"
        subtitle="Trend ao longo do período"
        data={d.daily}
        categories={["clicks", "spend"]}
        colors={["red", "amber"]}
        valueFormatter={(n) => num(n)}
      />
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-diletta-text2">Campanhas</h3>
        <DataTable
          columns={[
            { key: "name", label: "Campanha" },
            { key: "clicks", label: "Cliques", align: "right" },
            { key: "spend", label: "Investimento", align: "right" },
            { key: "cpc", label: "CPC", align: "right" },
            { key: "conversions", label: "Conv.", align: "right" },
          ]}
          rows={d.campaigns.map((c) => ({
            name: c.name,
            clicks: num(c.clicks),
            spend: brl(c.spend),
            cpc: brl(c.cpc),
            conversions: num(c.conversions),
          }))}
        />
      </div>
    </>
  );
}

function GscTab({ period }: { period: Period }) {
  const d = gscData(period);
  const brandClicks = d.queries.filter((q) => q.isBrand).reduce((a, b) => a + b.clicks, 0);
  const brandPct = d.total.clicks ? (brandClicks / d.total.clicks) * 100 : 0;
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Cliques orgânicos" value={num(d.total.clicks)} delta={11.2} />
        <KpiCard label="Impressões" value={num(d.total.impressions)} delta={45.3} />
        <KpiCard label="CTR média" value={pct(d.total.ctr, 1)} delta={-2.1} />
        <KpiCard label="% marca vs descoberta" value={pct(brandPct, 0)} delta={3.8} accent="amber" highlight />
      </div>
      <LineChartCard
        title="Cliques e impressões orgânicos — diário"
        subtitle="Search Console"
        data={d.daily}
        categories={["clicks", "impressions"]}
        colors={["red", "amber"]}
        valueFormatter={(n) => num(n)}
      />
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-diletta-text2">Top queries</h3>
        <DataTable
          columns={[
            { key: "query", label: "Query" },
            { key: "type", label: "Tipo", align: "center" },
            { key: "clicks", label: "Cliques", align: "right" },
            { key: "impressions", label: "Impressões", align: "right" },
            { key: "ctr", label: "CTR", align: "right" },
            { key: "position", label: "Posição", align: "right" },
          ]}
          rows={d.queries.map((q) => ({
            query: q.query,
            type: q.isBrand ? (<span className="rounded bg-amber-500/20 px-2 py-0.5 text-xs text-amber-300">marca</span>) : (<span className="rounded bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-300">descoberta</span>),
            clicks: num(q.clicks),
            impressions: num(q.impressions),
            ctr: pct(q.ctr, 1),
            position: q.position.toFixed(1),
          }))}
        />
      </div>
    </>
  );
}

function Ga4Tab({ period }: { period: Period }) {
  const d = ga4Data(period);
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Sessions" value={num(d.total.sessions)} delta={22.4} />
        <KpiCard label="Users" value={num(d.total.users)} delta={18.9} />
        <KpiCard label="generate_lead" value={num(d.total.generateLead)} delta={42.1} />
        <KpiCard label="calendly_book" value={num(d.total.calendlyBook)} delta={66.7} />
      </div>
      <LineChartCard
        title="Sessions, users e leads — diário"
        subtitle="Tendência multi-canal"
        data={d.daily}
        categories={["sessions", "users", "generateLead"]}
        colors={["red", "amber", "emerald"]}
        valueFormatter={(n) => num(n)}
      />
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-diletta-text2">Sessions por canal (Default Channel Grouping)</h3>
        <DataTable
          columns={[
            { key: "channel", label: "Canal" },
            { key: "sessions", label: "Sessions", align: "right" },
            { key: "users", label: "Users", align: "right" },
            { key: "share", label: "% sessions", align: "right" },
          ]}
          rows={d.channels.map((c) => ({
            channel: c.channel,
            sessions: num(c.sessions),
            users: num(c.users),
            share: pct((c.sessions / d.total.sessions) * 100, 1),
          }))}
        />
      </div>
    </>
  );
}

function LinkedinTab({ period }: { period: Period }) {
  const d = linkedinData(period);
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Investimento" value={brl(d.total.spend)} delta={9.4} />
        <KpiCard label="Cliques" value={num(d.total.clicks)} delta={12.6} />
        <KpiCard label="CTR" value={pct(d.total.ctr, 2)} delta={4.2} accent="green" />
        <KpiCard label="Leads convertidos" value={num(d.total.leads)} delta={0} accent="red" highlight />
      </div>
      <LineChartCard
        title="Impressões e cliques — diário"
        subtitle="LinkedIn Ads"
        data={d.daily}
        categories={["impressions", "clicks"]}
        colors={["amber", "red"]}
        valueFormatter={(n) => num(n)}
      />
      <div className="rounded-lg border border-diletta-red/40 bg-diletta-red/10 p-4">
        <div className="text-xs font-semibold uppercase tracking-widest text-diletta-red">Alerta crítico</div>
        <p className="mt-1 text-sm text-diletta-text1">
          A campanha <strong>C2 · Lead Gen</strong> está em rascunho/desativada. CTR do C1 (2,49%) está 3-6x acima do benchmark LinkedIn (0,4-0,9%), mas o tráfego ouro está caindo numa landing page sem conversão. Estimativa: ativando C2 com a mesma base de impressões geramos 5-10 leads/semana sem aumentar spend.
        </p>
      </div>
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-diletta-text2">Conjuntos de anúncios</h3>
        <DataTable
          columns={[
            { key: "name", label: "Conjunto" },
            { key: "status", label: "Status", align: "center" },
            { key: "impressions", label: "Impressões", align: "right" },
            { key: "clicks", label: "Cliques", align: "right" },
            { key: "spend", label: "Investimento", align: "right" },
            { key: "ctr", label: "CTR", align: "right" },
            { key: "leads", label: "Leads", align: "right" },
          ]}
          rows={d.campaigns.map((c) => ({
            name: c.name,
            status: c.status === "Ativa" ? (<span className="rounded bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-300">{c.status}</span>) : (<span className="rounded bg-red-500/20 px-2 py-0.5 text-xs text-red-300">{c.status}</span>),
            impressions: num(c.impressions),
            clicks: num(c.clicks),
            spend: brl(c.spend),
            ctr: pct(c.ctr, 2),
            leads: num(c.leads),
          }))}
        />
      </div>
    </>
  );
}
