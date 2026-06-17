import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function KpiCard({
  label, value, delta, deltaLabel, unit, accent = "default", highlight = false, verified = true,
}: {
  label: string;
  value: string;
  delta?: number;
  deltaLabel?: string;
  unit?: string;
  accent?: "default" | "red" | "green" | "amber";
  highlight?: boolean;
  verified?: boolean;
}) {
  const isUp = (delta ?? 0) >= 0;
  const isEmpty = value === "—" || value === "-";
  return (
    <div className={cn(
      "rounded-lg border bg-diletta-bg2 p-5",
      highlight ? "border-diletta-red/50 ring-1 ring-diletta-red/20" : "border-diletta-line",
    )}>
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium uppercase tracking-widest text-diletta-text3">{label}</div>
        {!verified && (
          <span className="rounded bg-amber-400/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-amber-300">
            não capturado
          </span>
        )}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <div className={cn(
          "font-serif text-4xl font-semibold leading-none",
          isEmpty ? "text-diletta-text3" :
          accent === "red" ? "text-diletta-red" :
          accent === "green" ? "text-diletta-green" :
          "text-diletta-text1"
        )}>
          {value}
        </div>
        {unit && !isEmpty && <div className="text-sm text-diletta-text3">{unit}</div>}
      </div>
      {delta !== undefined && !isEmpty && (
        <div className={cn(
          "mt-3 flex items-center gap-1 text-xs font-medium",
          isUp ? "text-emerald-400" : "text-red-400"
        )}>
          {isUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          <span>{isUp ? "+" : ""}{delta.toFixed(1)}%</span>
          <span className="text-diletta-text3">{deltaLabel || "vs período anterior"}</span>
        </div>
      )}
      {isEmpty && (
        <div className="mt-3 text-xs text-diletta-text3">
          Aguardando próxima captura
        </div>
      )}
    </div>
  );
}
