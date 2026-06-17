import { cn } from "@/lib/utils";

type Status = "live" | "mock" | "error" | "snapshot";

const COLORS: Record<Status, string> = {
  live: "bg-emerald-400",
  snapshot: "bg-emerald-400",
  mock: "bg-amber-400",
  error: "bg-red-500",
};

const LABELS: Record<Status, string> = {
  live: "API conectada",
  snapshot: "Snapshot manual",
  mock: "Mock (V0)",
  error: "Erro de sync",
};

export function HealthDot({ status, source, lastSyncAt }: { status: Status; source: string; lastSyncAt: string }) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-diletta-line bg-diletta-bg2 px-3 py-2">
      <span className={cn("h-1.5 w-1.5 rounded-full ring-2 ring-current/30", COLORS[status])} />
      <div className="text-xs">
        <div className="font-medium text-diletta-text1">{source}</div>
        <div className="text-diletta-text3">{LABELS[status]} · {new Date(lastSyncAt).toLocaleString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</div>
      </div>
    </div>
  );
}
