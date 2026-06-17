import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function brl(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 }).format(value);
}

export function pct(value: number, digits = 1) {
  return `${value.toFixed(digits)}%`;
}

export function num(value: number) {
  return new Intl.NumberFormat("pt-BR").format(value);
}

export function delta(curr: number, prev: number): { value: number; isUp: boolean; pct: number } {
  const diff = curr - prev;
  const pct = prev === 0 ? (curr > 0 ? 100 : 0) : (diff / prev) * 100;
  return { value: diff, isUp: diff >= 0, pct };
}

// Format helpers that respect null = "—"
export function brlOrDash(v: number | null | undefined): string {
  return v === null || v === undefined ? "—" : brl(v);
}
export function usdOrDash(v: number | null | undefined): string {
  if (v === null || v === undefined) return "—";
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(v);
}
export function numOrDash(v: number | null | undefined): string {
  return v === null || v === undefined ? "—" : num(v);
}
export function pctOrDash(v: number | null | undefined): string {
  return v === null || v === undefined ? "—" : pct(v);
}
