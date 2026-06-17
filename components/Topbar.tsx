"use client";
import { Period, PERIODS } from "@/data/mocks";
import { cn } from "@/lib/utils";

export function Topbar({ period, onChange, title, subtitle }: {
  period: Period;
  onChange: (p: Period) => void;
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="sticky top-0 z-10 border-b border-diletta-line bg-diletta-bg/80 backdrop-blur">
      <div className="flex items-center justify-between px-8 py-5">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-diletta-text1">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-diletta-text3">{subtitle}</p>}
        </div>
        <div className="flex rounded-md border border-diletta-line bg-diletta-bg2 p-1">
          {PERIODS.map((p) => (
            <button
              key={p.id}
              onClick={() => onChange(p.id)}
              className={cn(
                "rounded px-3 py-1.5 text-xs font-medium transition",
                period === p.id
                  ? "bg-diletta-red text-white"
                  : "text-diletta-text2 hover:bg-diletta-bg3 hover:text-diletta-text1"
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
