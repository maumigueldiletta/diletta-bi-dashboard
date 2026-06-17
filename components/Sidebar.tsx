"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, TrendingDown, TrendingUp, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Overview", icon: LayoutGrid },
  { href: "/inbound", label: "Inbound", icon: TrendingDown },
  { href: "/outbound", label: "Outbound", icon: TrendingUp },
];

export function Sidebar() {
  const path = usePathname();
  return (
    <aside className="fixed left-0 top-0 z-20 flex h-screen w-64 flex-col border-r border-diletta-line bg-diletta-bg2/80 backdrop-blur">
      <div className="flex items-center gap-3 border-b border-diletta-line px-6 py-5">
        <div className="grid h-8 w-8 place-items-center rounded bg-diletta-red text-xs font-bold text-white">D</div>
        <div className="leading-tight">
          <div className="text-sm font-bold tracking-wider">DILETTA<span className="text-diletta-red">.</span> BI</div>
          <div className="text-[10px] uppercase tracking-widest text-diletta-text3">Marketing dashboard</div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4">
        {items.map(({ href, label, icon: Icon }) => {
          const active = path === href || (href !== "/" && path.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-diletta-red/15 text-diletta-text1 ring-1 ring-diletta-red/40"
                  : "text-diletta-text2 hover:bg-diletta-bg3 hover:text-diletta-text1"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-diletta-line p-3 text-xs text-diletta-text3">
        <div className="px-3 py-2">
          <div className="mb-1 font-semibold uppercase tracking-wider text-diletta-text2">Status</div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 ring-2 ring-amber-400/30"/>
            <span>V0 · dados mock</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
