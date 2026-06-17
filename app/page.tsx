"use client";
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { KpiCard } from "@/components/KpiCard";
import { HealthDot } from "@/components/HealthDot";
import { DataTable } from "@/components/DataTable";
import { LineChartCard } from "@/components/charts/LineChartCard";
import { brl, num, pct } from "@/lib/utils";
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
          subtitle="Foto consolidada de marketing — Inbound + Outbound em um lugar."
        />
        <div className="space-y-6 px-8 py-8">
          {/* KPI row */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <KpiCard label="Investimento total" value={brl(data.totalSpend)} delta={18.4} />
            <KpiCard label="Leads gerados" value={num(data.totalLeads)} delta={42.1} />
            <KpiCard label="Custo por lead" value={brl(data.cpl || 0)} delta={-12.3} accent={data.cpl > 200 ? "red" : "default"} />
            <KpiCard label="Reuniões agendadas" value={num(data.totalMeetings)} delta={66.7} />
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <LineChartCard
              title="Investimento por canal"
              subtitle="Spend diário Google Ads + LinkedIn Ads"
              data={data.spendByChannel}
              categories={["Google Ads", "LinkedIn Ads"]}
              colors={["red", "blue"]}
              valueFormatter={(n) => brl(n)}
            />
            <LineChartCard
              title="Leads por canal"
              subtitle="Eventos generate_lead diários"
              data={data.leadsByChannel}
              categories={["Inbound (web)", "LinkedIn Lead Gen"]}
              colors={["red", "amber"]}
              valueFormatter={(n) => num(n)}
            />
          </div>

          {/* Resumo por canal */}
          <div>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-diletta-text2">Resumo por canal</h2>
            <DataTable
              columns={[
                { key: "channel", label: "Canal" },
                { key: "impressions", label: "Impressões", align: "right" },
                { key: "clicks", label: "Cliques", align: "right" },
                { key: "spend", label: "Investimento", align: "right" },
                { key: "ctr", label: "CTR", align: "right" },
                { key: "cpc", label: "CPC", align: "right" },
              ]}
              rows={[
                { channel: "Google Ads", impressions: num(ads.total.impressions), clicks: num(ads.total.clicks), spend: brl(ads.total.spend), ctr: pct(ads.total.ctr), cpc: brl(ads.total.cpc) },
                { channel: "LinkedIn Ads (paid)", impressions: num(li.total.impressions), clicks: num(li.total.clicks), spend: brl(li.total.spend), ctr: pct(li.total.ctr), cpc: brl(li.total.cpc) },
                { channel: "Search Console (orgânico)", impressions: num(gsc.total.impressions), clicks: num(gsc.total.clicks), spend: "—", ctr: pct(gsc.total.ctr), cpc: "—" },
              ]}
            />
          </div>

          {/* Health */}
          <div>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-diletta-text2">Status de sincronização</h2>
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
