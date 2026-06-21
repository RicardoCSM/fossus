"use client";

import type { BueiroDto } from "@fossus/api-types";
import { Button } from "@fossus/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@fossus/ui/components/dialog";

import { BueiroStatusColors, BueiroStatusLabels } from "@/constants/bueiro-status";
import Link from "next/link";

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("pt-BR");
}

function formatMeasurement(value: number | null, unit: string) {
  return value !== null ? `${value} ${unit}` : "—";
}

interface BueiroDetailsDialogProps {
  bueiro: BueiroDto | null;
  onOpenChange: (open: boolean) => void;
}

export function BueiroDetailsDialog({ bueiro, onOpenChange }: BueiroDetailsDialogProps) {
  return (
    <Dialog open={bueiro !== null} onOpenChange={onOpenChange}>
      <DialogContent>
        {bueiro && (
          <>
            <DialogHeader>
              <DialogTitle>
                {bueiro.endereco.rua}
                {bueiro.endereco.numero !== null ? `, ${bueiro.endereco.numero}` : ""}
              </DialogTitle>
              <DialogDescription className="flex items-center gap-1.5">
                <span className={`size-1.5 rounded-full ${BueiroStatusColors[bueiro.status].bg}`} />
                {BueiroStatusLabels[bueiro.status]} • {bueiro.alertas_ativos} alerta(s) ativo(s)
              </DialogDescription>
            </DialogHeader>

            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <div>
                <dt className="text-xs text-muted-foreground">Bairro</dt>
                <dd>{bueiro.endereco.bairro ?? "—"}</dd>
              </div>

              <div>
                <dt className="text-xs text-muted-foreground">Cidade/UF</dt>
                <dd>
                  {bueiro.endereco.cidade}/{bueiro.endereco.estado}
                </dd>
              </div>

              <div>
                <dt className="text-xs text-muted-foreground">CEP</dt>
                <dd>{bueiro.endereco.cep ?? "—"}</dd>
              </div>

              <div>
                <dt className="text-xs text-muted-foreground">Instalado em</dt>
                <dd>{formatDate(bueiro.data_instalacao)}</dd>
              </div>

              <div>
                <dt className="text-xs text-muted-foreground">Diâmetro</dt>
                <dd>{formatMeasurement(bueiro.diametro, "cm")}</dd>
              </div>

              <div>
                <dt className="text-xs text-muted-foreground">Profundidade</dt>
                <dd>{formatMeasurement(bueiro.profundidade, "cm")}</dd>
              </div>

              <div>
                <dt className="text-xs text-muted-foreground">Capacidade de fluxo</dt>
                <dd>{formatMeasurement(bueiro.capacidade_fluxo, "L/s")}</dd>
              </div>

              <div>
                <dt className="text-xs text-muted-foreground">Coordenadas</dt>
                <dd>
                  {bueiro.endereco.latitude !== null ? bueiro.endereco.latitude.toFixed(4) : "—"},{" "}
                  {bueiro.endereco.longitude !== null ? bueiro.endereco.longitude.toFixed(4) : "—"}
                </dd>
              </div>
            </dl>
          </>
        )}
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Fechar</Button>} />
          <Button
            nativeButton={false}
            render={<Link href={`/bueiros/${bueiro?.id}`}>Ver detalhes</Link>}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
