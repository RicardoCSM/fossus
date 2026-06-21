"use client";

import { useState } from "react";

import type { BueiroDto, BueiroStatus } from "@fossus/api-types";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@fossus/ui/components/collapsible";
import { Map, MapMarker, MarkerContent, MarkerTooltip } from "@fossus/ui/components/ui/map";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, FlagTriangleRight } from "lucide-react";

import { fetchBueirosList } from "@/actions/bueiros";
import { BairrosStatusChart } from "@/components/bairros-status-chart";
import { BueiroDetailsDialog } from "@/components/bueiro-details-dialog";
import { BueiroStatusColors, BueiroStatusLabels } from "@/constants/bueiro-status";
import { CreateBueiroDialog } from "@/components/create-bueiro-dialog";

function hasCoordinates(
  bueiro: BueiroDto,
): bueiro is BueiroDto & { endereco: { latitude: number; longitude: number } } {
  return bueiro.endereco.latitude !== null && bueiro.endereco.longitude !== null;
}

export default function Home() {
  const [selectedBueiro, setSelectedBueiro] = useState<BueiroDto | null>(null);

  const {
    data: bueiros = [],
    dataUpdatedAt,
    refetch,
  } = useQuery({
    queryKey: ["bueiros"],
    queryFn: async () => {
      const result = await fetchBueirosList();
      if (!result.success) throw new Error(result.message);
      return result.data;
    },
  });

  const counts = bueiros.reduce(
    (acc, bueiro) => {
      acc[bueiro.status] += 1;
      return acc;
    },
    { normal: 0, warning: 0, critical: 0 } satisfies Record<BueiroStatus, number>,
  );

  return (
    <Map
      center={[-42.14172, -19.79159]}
      zoom={15}
      styles={{
        light: "https://tiles.stadiamaps.com/styles/alidade_smooth.json",
      }}
    >
      <div className="absolute top-2 left-2 right-2 z-10 flex flex-wrap items-start justify-between gap-2 sm:top-4 sm:left-4 sm:right-4">
        <Collapsible
          defaultOpen
          className="rounded-xl border border-border bg-background dark:border-input dark:bg-background"
        >
          <CollapsibleTrigger className="group flex w-full items-center justify-between gap-2 p-4 text-left text-sm font-medium text-foreground">
            Rede de Drenagem
            <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-open:rotate-180" />
          </CollapsibleTrigger>

          <CollapsibleContent className="px-4 pb-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className={`text-xl font-semibold ${BueiroStatusColors.normal.text}`}>
                  {counts.normal}
                </div>
                <div className="text-xs text-muted-foreground">Normais</div>
              </div>

              <div>
                <div className={`text-xl font-semibold ${BueiroStatusColors.warning.text}`}>
                  {counts.warning}
                </div>
                <div className="text-xs text-muted-foreground">Alertas</div>
              </div>

              <div>
                <div className={`text-xl font-semibold ${BueiroStatusColors.critical.text}`}>
                  {counts.critical}
                </div>
                <div className="text-xs text-muted-foreground">Críticos</div>
              </div>
            </div>

            {dataUpdatedAt > 0 && (
              <div className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">
                Atualizado às {new Date(dataUpdatedAt).toLocaleTimeString("pt-BR")}
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>

        <div className="rounded-lg bg-background">
          <CreateBueiroDialog refetch={refetch} />
        </div>
      </div>

      {bueiros.filter(hasCoordinates).map((bueiro) => {
        const colors = BueiroStatusColors[bueiro.status];

        return (
          <MapMarker
            key={bueiro.id}
            longitude={bueiro.endereco.longitude}
            latitude={bueiro.endereco.latitude}
            onClick={() => setSelectedBueiro(bueiro)}
          >
            <MarkerContent>
              <div className={`${colors.bg} cursor-pointer rounded-full p-1.5 shadow-lg`}>
                <FlagTriangleRight className="size-4 text-white" />
              </div>
            </MarkerContent>

            <MarkerTooltip>
              <div className="space-y-0.5 text-xs">
                <div className="font-medium">
                  {bueiro.endereco.rua}
                  {bueiro.endereco.numero !== null ? `, ${bueiro.endereco.numero}` : ""}
                </div>

                <div className="flex items-center gap-1">
                  <span className={`size-1.5 rounded-full ${colors.bg}`} />
                  <span className={colors.text}>{BueiroStatusLabels[bueiro.status]}</span>
                </div>

                <div className="text-background/60 text-[11px]">
                  {bueiro.alertas_ativos} alerta(s) ativo(s)
                </div>
              </div>
            </MarkerTooltip>
          </MapMarker>
        );
      })}

      <div className="absolute bottom-2 left-2 z-10 w-full max-w-sm sm:bottom-4 sm:left-4">
        <BairrosStatusChart bueiros={bueiros} />
      </div>

      <BueiroDetailsDialog
        bueiro={selectedBueiro}
        onOpenChange={(open) => !open && setSelectedBueiro(null)}
      />
    </Map>
  );
}
