import { cn } from "@/lib/utils";

export function HealthDot({ status, source, lastSyncAt }: { status: "live" | "mock" | "error"; source: string; lastSyncAt: string }) {
  const color = status === "live" ? "bg-emerald-400" : status === "error" ? "bg-red-500" : "bg-amber-400";
  const label = status === "live" ? "API conectada" : status === "error" ? "Erro de sync" : "Mock (V0)";
  return (
    <div className="flex items-center gap-3 rounded-md border border-diletta-line bg-diletta-bg2 px-3 py-2">
      <span className={cn("h-1.5 w-1.5 rounded-full ring-2 ring-current/30", color)} />
      <div className="text-xs">
        <div className="font-medium text-diletta-text1">{source}</div>
        <div className="text-diletta-text3">{label} · {new Date(lastSyncAt).toLocaleString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</div>
      </div>
    </div>
  );
}
