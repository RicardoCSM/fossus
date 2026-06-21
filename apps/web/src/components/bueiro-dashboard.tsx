"use client";

import { fetchBueiroDashboard } from "@/actions/bueiros";
import { BueiroStatusColors, BueiroStatusLabels } from "@/constants/bueiro-status";
import type { BueiroDto } from "@fossus/api-types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@fossus/ui/components/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@fossus/ui/components/chart";
import { Skeleton } from "@fossus/ui/components/skeleton";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Radio, Wrench } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

interface BueiroDashboardProps {
  bueiro: BueiroDto;
}

const CHART_COLORS = [
  "var(--chart-5)",
  "var(--chart-4)",
  "var(--chart-3)",
  "var(--chart-2)",
  "var(--chart-1)",
];

function formatTipoLabel(tipo: string) {
  return tipo
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/^./, (char) => char.toUpperCase());
}

function formatMonthLabel(mes: string) {
  const [year, month] = mes.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString("pt-BR", {
    month: "short",
  });
}

export function BueiroDashboard({ bueiro }: BueiroDashboardProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["bueiro-dashboard", bueiro.id],
    queryFn: async () => {
      const result = await fetchBueiroDashboard(bueiro.id);
      if (!result.success) throw new Error(result.message);
      return result.data;
    },
  });

  if (isLoading || !data) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-28 w-full" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
          <Skeleton className="h-80 w-full lg:col-span-4" />
          <Skeleton className="h-80 w-full lg:col-span-3" />
        </div>
      </div>
    );
  }

  const statusColors = BueiroStatusColors[data.status];
  const tipos = data.alertas_por_tipo.map((item) => item.tipo);
  const maxTipoTotal = Math.max(...data.alertas_por_tipo.map((item) => item.total), 1);

  const chartConfig = tipos.reduce<ChartConfig>((config, tipo, index) => {
    config[tipo] = {
      label: formatTipoLabel(tipo),
      color: CHART_COLORS[index % CHART_COLORS.length],
    };
    return config;
  }, {});

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <span className={`size-2.5 rounded-full ${statusColors.bg}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${statusColors.text}`}>
              {BueiroStatusLabels[data.status]}
            </div>
            <p className="text-xs text-muted-foreground">
              {data.totals.alertas_ativos} alerta(s) ativo(s)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sensores</CardTitle>
            <Radio className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.totals.sensores_ativos}/{data.totals.sensores_total}
            </div>
            <p className="text-xs text-muted-foreground">Sensores ativos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Manutenções</CardTitle>
            <Wrench className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totals.manutencoes_abertas}</div>
            <p className="text-xs text-muted-foreground">
              em aberto de {data.totals.manutencoes_total} no total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas</CardTitle>
            <AlertTriangle className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totals.alertas_ativos}</div>
            <p className="text-xs text-muted-foreground">de {data.totals.alertas_total} no total</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Alertas por mês</CardTitle>
            <CardDescription>Distribuição por tipo nos últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent className="px-2 pt-4 sm:px-6">
            {tipos.length === 0 ? (
              <p className="py-12 text-center text-sm text-muted-foreground">
                Nenhum alerta registrado no período.
              </p>
            ) : (
              <ChartContainer config={chartConfig} className="aspect-auto h-65 w-full">
                <BarChart data={data.alertas_por_mes}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="mes"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={formatMonthLabel}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        labelFormatter={(value) => formatMonthLabel(String(value))}
                      />
                    }
                  />
                  {tipos.map((tipo) => (
                    <Bar
                      key={tipo}
                      dataKey={tipo}
                      stackId="alertas"
                      fill={`var(--color-${tipo})`}
                      radius={2}
                    />
                  ))}
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Alertas por tipo</CardTitle>
            <CardDescription>Total no período analisado</CardDescription>
          </CardHeader>
          <CardContent>
            {data.alertas_por_tipo.length === 0 ? (
              <p className="py-12 text-center text-sm text-muted-foreground">
                Nenhum alerta registrado no período.
              </p>
            ) : (
              <ul className="space-y-3">
                {data.alertas_por_tipo.map((item) => (
                  <li key={item.tipo} className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 truncate text-xs text-muted-foreground">
                        {formatTipoLabel(item.tipo)}
                      </div>
                      <div className="h-2.5 w-full rounded-full bg-muted">
                        <div
                          className="h-2.5 rounded-full bg-chart-5"
                          style={{
                            width: `${Math.round((item.total / maxTipoTotal) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="ps-2 text-xs font-medium tabular-nums">{item.total}</div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
