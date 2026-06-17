"use client";
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { KpiCard } from "@/components/KpiCard";
import { HealthDot } from "@/components/HealthDot";
import { DataTable } from "@/components/DataTable";
import { LineChartCard } from "@/components/charts/LineChartCard";
import { brl, brlOrDash, usdOrDash, num, numOrDash, pct, pctOrDash } from "@/lib/utils";
import { overviewData, googleAdsData, gscData, linkedinData, syncStatus, Period } from "@/data/mocks";

export default function OverviewPage() {
  const [period, setPeriod] = useState<Period>("30d");
  const data = overviewData(period);
  const ads = googleAdsData(period);
  const gsc = gscData(period);
  const li = linkedinData(period);

  return (
    <div className="brand-grid min-h-screen">
      <Sidebar />
      <div className="ml-64">
        <Topbar
          period={period}
          onChange={setPeriod}
          title="Overview executivo"
          subtitle="Foto consolidada de marketing — Google Ads + LinkedIn + GSC."
        />
        <div className="space-y-6 px-8 py-8">
          {/* KPI row — honest about what's verified */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <KpiCard label="Investimento Google Ads (BRL)" value={brl(data.totalSpendBrl)} />
            <KpiCard label="Investimento LinkedIn (USD)" value={usdOrDash(data.totalSpendUsd)} />
            <KpiCard label="Leads gerados" value={numOrDash(data.totalLeads)} verified={data.totalLeads !== null} />
            <KpiCard label="Reuniões agendadas" value={numOrDash(data.totalMeetings)} verified={data.totalMeetings !== null} />
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <LineChartCard
              title="Investimento Google Ads (diário)"
              subtitle={`Total ${ads.period} dividido linearmente — totais reais, distribuição diária estimada`}
              data={data.spendByChannel}
              categories={["Google Ads (BRL)"]}
              colors={["red"]}
              valueFormatter={(n) => brl(n)}
            />
            <div className="rounded-lg border border-diletta-line bg-diletta-bg2 p-5">
              <div className="text-xs font-medium uppercase tracking-widest text-diletta-text3">Leads por canal (diário)</div>
              <div className="mt-6 flex h-48 flex-col items-center justify-center gap-2 text-center">
                <div className="font-serif text-2xl text-diletta-text3">Aguardando captura</div>
                <div className="text-xs text-diletta-text3">
                  Evento <code className="rounded bg-diletta-bg px-1 py-0.5">generate_lead</code> do GA4 ainda não foi capturado nesta sessão.
                </div>
              </div>
            </div>
          </div>

          {/* Resumo por canal */}
          <div>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-diletta-text2">Resumo por canal</h2>
            <DataTable
              columns={[
                { key: "channel", label: "Canal" },
                { key: "period", label: "Período" },
                { key: "impressions", label: "Impressões", align: "right" },
                { key: "clicks", label: "Cliques", align: "right" },
                { key: "spend", label: "Investimento", align: "right" },
                { key: "ctr", label: "CTR", align: "right" },
                { key: "cpc", label: "CPC", align: "right" },
              ]}
              rows={[
                { channel: "Google Ads", period: ads.period, impressions: num(ads.total.impressions), clicks: num(ads.total.clicks), spend: brl(ads.total.spend), ctr: pct(ads.total.ctr), cpc: brl(ads.total.cpc) },
                { channel: "LinkedIn Ads", period: li.period, impressions: numOrDash(li.total.impressions), clicks: num(li.total.clicks), spend: usdOrDash(li.total.spend), ctr: pctOrDash(li.total.ctr), cpc: li.total.cpc ? usdOrDash(li.total.cpc) : "—" },
                { channel: "Search Console (orgânico)", period: gsc.period, impressions: num(gsc.total.impressions), clicks: num(gsc.total.clicks), spend: "—", ctr: pct(gsc.total.ctr), cpc: "—" },
              ]}
            />
          </div>

          {/* Health */}
          <div>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-diletta-text2">Status do snapshot</h2>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
              {syncStatus.map((s) => (
                <HealthDot key={s.source} status={s.status} source={s.source} lastSyncAt={s.lastSyncAt} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
