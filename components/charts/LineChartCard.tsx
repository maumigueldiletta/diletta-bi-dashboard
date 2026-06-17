"use client";
import { AreaChart } from "@tremor/react";

export function LineChartCard({
  title, subtitle, data, categories, colors, valueFormatter,
}: {
  title: string;
  subtitle?: string;
  data: any[];
  categories: string[];
  colors?: string[];
  valueFormatter?: (n: number) => string;
}) {
  return (
    <div className="rounded-lg border border-diletta-line bg-diletta-bg2 p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-diletta-text2">{title}</h3>
        {subtitle && <p className="mt-1 text-xs text-diletta-text3">{subtitle}</p>}
      </div>
      <AreaChart
        className="h-64"
        data={data}
        index="date"
        categories={categories}
        colors={colors || ["red", "amber"]}
        valueFormatter={valueFormatter}
        showLegend={true}
        showGridLines={false}
        yAxisWidth={50}
      />
    </div>
  );
}
