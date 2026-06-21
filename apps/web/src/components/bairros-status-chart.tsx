"use client";

import type { BueiroDto, BueiroStatus } from "@fossus/api-types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@fossus/ui/components/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@fossus/ui/components/chart";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@fossus/ui/components/collapsible";
import { ChevronDown } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { BueiroStatusLabels } from "@/constants/bueiro-status";

interface BairrosStatusChartProps {
  bueiros: BueiroDto[];
}

type BairroCounts = Record<BueiroStatus, number> & { bairro: string };

const STATUS_ORDER: BueiroStatus[] = ["normal", "warning", "critical"];

const STATUS_RADIUS: Record<BueiroStatus, [number, number, number, number]> = {
  normal: [0, 0, 4, 4],
  warning: [0, 0, 0, 0],
  critical: [4, 4, 0, 0],
};

const CHART_CONFIG: ChartConfig = {
  normal: { label: BueiroStatusLabels.normal, color: "#10b981" },
  warning: { label: BueiroStatusLabels.warning, color: "#f59e0b" },
  critical: { label: BueiroStatusLabels.critical, color: "#ef4444" },
};

function groupByBairro(bueiros: BueiroDto[]): BairroCounts[] {
  const groups = new Map<string, BairroCounts>();

  for (const bueiro of bueiros) {
    const bairro = bueiro.endereco.bairro ?? "Sem bairro";
    const counts = groups.get(bairro) ?? {
      bairro,
      normal: 0,
      warning: 0,
      critical: 0,
    };
    counts[bueiro.status] += 1;
    groups.set(bairro, counts);
  }

  return Array.from(groups.values()).sort(
    (a, b) =>
      b.normal + b.warning + b.critical - (a.normal + a.warning + a.critical) ||
      a.bairro.localeCompare(b.bairro),
  );
}

export function BairrosStatusChart({ bueiros }: BairrosStatusChartProps) {
  const data = groupByBairro(bueiros);

  if (data.length === 0) return null;

  const criticos = bueiros.filter((bueiro) => bueiro.status === "critical").length;

  return (
    <Card className="border-border bg-background dark:bg-background">
      <Collapsible defaultOpen>
        <CollapsibleTrigger
          nativeButton={false}
          render={<CardHeader className="group cursor-pointer select-none" />}
        >
          <CardTitle className="flex items-center justify-between gap-2">
            Bueiros por bairro
            <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-open:rotate-180" />
          </CardTitle>
          <CardDescription>Status consolidado da rede de drenagem por bairro</CardDescription>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="p-0">
            <ChartContainer config={CHART_CONFIG} className="aspect-auto h-48 w-full">
              <BarChart accessibilityLayer data={data}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="bairro"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                  height={48}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                {STATUS_ORDER.map((status) => (
                  <Bar
                    key={status}
                    dataKey={status}
                    stackId="status"
                    fill={`var(--color-${status})`}
                    radius={STATUS_RADIUS[status]}
                  />
                ))}
              </BarChart>
            </ChartContainer>
          </CardContent>

          <CardFooter className="flex-col items-start gap-1 text-sm">
            <div className="leading-none text-muted-foreground">
              {data.length} bairro(s) monitorado(s) • {bueiros.length} bueiro(s) ao total
              {criticos > 0 ? ` • ${criticos} em estado crítico` : ""}
            </div>
          </CardFooter>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
