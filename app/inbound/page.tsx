"use client";
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { KpiCard } from "@/components/KpiCard";
import { DataTable } from "@/components/DataTable";
import { LineChartCard } from "@/components/charts/LineChartCard";
import { brl, num, pct, brlOrDash, usdOrDash, numOrDash, pctOrDash, cn } from "@/lib/utils";
import { googleAdsData, gscData, ga4Data, linkedinData, Period } from "@/data/mocks";

type Tab = "google-ads" | "gsc" | "ga4" | "linkedin-ads";

const TABS: { id: Tab; label: string }[] = [
  { id: "google-ads", label: "Google Ads" },
  { id: "gsc", label: "Search Console" },
  { id: "ga4", label: "Google Analytics 4" },
  { id: "linkedin-ads", label: "LinkedIn Ads" },
];

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-diletta-line bg-diletta-bg2 p-8 text-center">
      <div className="font-serif text-xl text-diletta-text3">Aguardando captura</div>
      <div className="mt-2 text-sm text-diletta-text3">{message}</div>
    </div>
  );
}

export default function InboundPage() {
  const [period, setPeriod] = useState<Period>("30d");
  const [tab, setTab] = useState<Tab>("google-ads");

  return (
    <div className="brand-grid min-h-screen">
      <Sidebar />
      <div className="ml-64">
        <Topbar period={period} onChange={setPeriod} title="Inbound" subtitle="Tráfego e leads de canais de aquisição inbound." />
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

function PeriodBanner({ period }: { period: string }) {
  return (
    <div className="rounded-md border border-diletta-line bg-diletta-bg2/60 px-4 py-2 text-xs text-diletta-text3">
      Snapshot capturado pra <span className="text-diletta-text1">{period}</span> — período do filtro é informativo
    </div>
  );
}

function GoogleAdsTab({ period }: { period: Period }) {
  const d = googleAdsData(period);
  return (
    <>
      <PeriodBanner period={d.period} />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Investimento" value={brl(d.total.spend)} />
        <KpiCard label="Cliques" value={num(d.total.clicks)} />
        <KpiCard label="CPC médio" value={brl(d.total.cpc)} accent={d.total.cpc > 9 ? "red" : "default"} highlight={d.total.cpc > 9} />
        <KpiCard label="CTR" value={pct(d.total.ctr, 2)} />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Impressões" value={num(d.total.impressions)} />
        <KpiCard label="Conversões" value={num(d.total.conversions)} />
        <KpiCard label="Taxa conv." value={pct(d.total.convRate, 2)} />
        <KpiCard label="Custo/conv." value={brl(d.total.costPerConv)} />
      </div>
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-diletta-text2">Campanhas (todas)</h3>
        <DataTable
          columns={[
            { key: "name", label: "Campanha" },
            { key: "status", label: "Status", align: "center" },
            { key: "impressions", label: "Impr.", align: "right" },
            { key: "clicks", label: "Cliques", align: "right" },
            { key: "ctr", label: "CTR", align: "right" },
            { key: "spend", label: "Investimento", align: "right" },
            { key: "conversions", label: "Conv.", align: "right" },
            { key: "cpc", label: "CPC", align: "right" },
          ]}
          rows={d.campaigns.map((c: any) => ({
            name: c.name,
            status: c.status === "Qualificada" ? (
              <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-300">{c.status}</span>
            ) : c.status === "Removida" ? (
              <span className="rounded bg-red-500/20 px-2 py-0.5 text-xs text-red-300">{c.status}</span>
            ) : (
              <span className="rounded bg-amber-500/20 px-2 py-0.5 text-xs text-amber-300">{c.status}</span>
            ),
            impressions: num(c.impressions),
            clicks: num(c.clicks),
            ctr: pct(c.ctr, 2),
            spend: brl(c.spend),
            conversions: num(c.conversions),
            cpc: brl(c.cpc),
          }))}
        />
      </div>
    </>
  );
}

function GscTab({ period }: { period: Period }) {
  const d = gscData(period);
  const brandClicks = d.queries.filter((q: any) => q.isBrand).reduce((a: number, b: any) => a + b.clicks, 0);
  const brandPct = d.total.clicks ? (brandClicks / d.total.clicks) * 100 : 0;
  return (
    <>
      <PeriodBanner period={d.period} />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Cliques orgânicos" value={num(d.total.clicks)} />
        <KpiCard label="Impressões" value={num(d.total.impressions)} />
        <KpiCard label="CTR média" value={pct(d.total.ctr, 1)} />
        <KpiCard label="% marca vs descoberta" value={pct(brandPct, 0)} accent="amber" highlight />
      </div>
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-diletta-text2">Top queries</h3>
        <DataTable
          columns={[
            { key: "query", label: "Query" },
            { key: "type", label: "Tipo", align: "center" },
            { key: "clicks", label: "Cliques", align: "right" },
            { key: "impressions", label: "Impressões", align: "right" },
            { key: "position", label: "Posição", align: "right" },
          ]}
          rows={d.queries.map((q: any) => ({
            query: q.query,
            type: q.isBrand ? (
              <span className="rounded bg-amber-500/20 px-2 py-0.5 text-xs text-amber-300">marca</span>
            ) : (
              <span className="rounded bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-300">descoberta</span>
            ),
            clicks: num(q.clicks),
            impressions: num(q.impressions),
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
      <PeriodBanner period={d.period} />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Usuários 7d" value={num(d.snapshot7d.users)} delta={d.snapshot7d.vsPrev.users} />
        <KpiCard label="Visualizações 7d" value={num(d.snapshot7d.views)} delta={d.snapshot7d.vsPrev.views} />
        <KpiCard label="Eventos 7d" value={num(d.snapshot7d.events)} delta={d.snapshot7d.vsPrev.events} />
        <KpiCard label="Engajamento" value={pctOrDash(d.total.engagementRate)} verified={d.total.engagementRate !== null} />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="generate_lead (30d)" value={numOrDash(d.total.generateLead)} verified={d.total.generateLead !== null} />
        <KpiCard label="calendly_book (30d)" value={numOrDash(d.total.calendlyBook)} verified={d.total.calendlyBook !== null} />
        <KpiCard label="Sessions (30d)" value={numOrDash(d.total.sessions)} verified={d.total.sessions !== null} />
        <KpiCard label="Users (30d)" value={num(d.total.users)} />
      </div>
      <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 text-sm">
        <div className="font-semibold text-amber-300">⚠️ Próxima captura GA4</div>
        <p className="mt-1 text-diletta-text2">
          Pra o dashboard mostrar eventos <code className="rounded bg-diletta-bg px-1">generate_lead</code> e
          <code className="rounded bg-diletta-bg px-1"> calendly_book_completed</code> reais por mês, mais channel mix da Aquisição,
          rode <span className="text-diletta-text1">"atualiza dashboard"</span> que Claude varre Relatórios → Eventos + Aquisição.
        </p>
      </div>
      {d.channels === null ? (
        <EmptyState message="Channel mix do GA4 não foi capturado. Próximo 'atualiza dashboard' vai puxar de Aquisição → Aquisição de tráfego." />
      ) : null}
    </>
  );
}

function LinkedinTab({ period }: { period: Period }) {
  const d = linkedinData(period);
  return (
    <>
      <PeriodBanner period={d.period} />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Investimento (USD)" value={usdOrDash(d.total.spend)} />
        <KpiCard label="Cliques" value={num(d.total.clicks)} />
        <KpiCard label="Impressões" value={numOrDash(d.total.impressions)} verified={d.total.impressions !== null} />
        <KpiCard label="CTR" value={pctOrDash(d.total.ctr)} verified={d.total.ctr !== null} />
      </div>
      <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 text-sm">
        <div className="font-semibold text-amber-300">⚠️ Próxima captura LinkedIn</div>
        <p className="mt-1 text-diletta-text2">
          Impressões totais e CTR ainda não foram capturados nesta sessão. Rode <span className="text-diletta-text1">"atualiza dashboard"</span> que
          Claude entra em cada conjunto pra pegar Impressions Served e demographics (job titles + industries).
        </p>
      </div>
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-diletta-text2">Conjuntos de anúncios</h3>
        <DataTable
          columns={[
            { key: "name", label: "Conjunto" },
            { key: "status", label: "Status", align: "center" },
            { key: "result", label: "Resultado", align: "left" },
            { key: "clicks", label: "Cliques", align: "right" },
            { key: "spend", label: "Despesa (USD)", align: "right" },
            { key: "cpc", label: "CPC (USD)", align: "right" },
          ]}
          rows={d.campaigns.map((c: any) => ({
            name: c.name,
            status: c.status === "Ativa" ? (
              <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-300">{c.status}</span>
            ) : (
              <span className="rounded bg-red-500/20 px-2 py-0.5 text-xs text-red-300">{c.status}</span>
            ),
            result: c.result,
            clicks: num(c.clicks),
            spend: usdOrDash(c.spendUsd),
            cpc: c.cpcUsd ? usdOrDash(c.cpcUsd) : "—",
          }))}
        />
      </div>
    </>
  );
}
