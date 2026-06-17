"use client";
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { Period } from "@/data/mocks";
import { cn } from "@/lib/utils";
import { Mail, Database, Calendar, Zap } from "lucide-react";

type Tab = "instantly" | "pipedrive" | "calendly";

const TABS: { id: Tab; label: string; icon: any; desc: string }[] = [
  { id: "instantly", label: "Instantly (cold email)", icon: Mail, desc: "Sequências, open rate, reply rate, bounces e warmup status." },
  { id: "pipedrive", label: "Pipedrive (CRM)", icon: Database, desc: "Pipeline value, deals abertos, won/lost, atividades por SDR." },
  { id: "calendly", label: "Calendly (reuniões)", icon: Calendar, desc: "Reuniões agendadas, origem, no-show rate, conversão por SDR." },
];

export default function OutboundPage() {
  const [period, setPeriod] = useState<Period>("30d");
  const [tab, setTab] = useState<Tab>("instantly");
  const active = TABS.find((t) => t.id === tab)!;

  return (
    <div className="brand-grid min-h-screen">
      <Sidebar />
      <div className="ml-64">
        <Topbar period={period} onChange={setPeriod} title="Outbound" subtitle="Cold email, CRM e reuniões agendadas." />

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

        <div className="px-8 py-12">
          <div className="rounded-xl border border-diletta-line bg-diletta-bg2 p-16 text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-diletta-red/15 ring-1 ring-diletta-red/30">
              <active.icon className="h-8 w-8 text-diletta-red" />
            </div>
            <h2 className="mt-6 font-serif text-2xl font-semibold">{active.label}</h2>
            <div className="mt-2 inline-block rounded bg-amber-500/15 px-3 py-1 text-xs font-medium uppercase tracking-widest text-amber-300">
              Integração em breve · V1.1
            </div>
            <p className="mx-auto mt-4 max-w-md text-sm text-diletta-text2">{active.desc}</p>
            <div className="mt-6 inline-flex items-center gap-2 text-xs text-diletta-text3">
              <Zap className="h-3.5 w-3.5" /> Roadmap: ativar nas próximas 2 semanas após V0 estabilizar.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
