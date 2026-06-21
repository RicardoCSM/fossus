import prisma, { Prisma } from "@fossus/db";
import type {
  AlertaPorMesDto,
  AlertaPorTipoDto,
  BueiroDashboardDto,
  BueiroDto,
  BueiroStatus,
} from "@fossus/api-types";
import type { CreateBueiroInput, UpdateBueiroInput } from "../schemas/bueiros";

const BUEIRO_SELECT = {
  id: true,
  diametro: true,
  profundidade: true,
  capacidade_fluxo: true,
  data_instalacao: true,
  enderecos: {
    select: {
      id: true,
      rua: true,
      numero: true,
      cep: true,
      latitude: true,
      longitude: true,
    },
  },
  alertas: {
    where: { resolvido: false },
    select: { nivel: true },
  },
} as const;

type BueiroRow = Prisma.bueirosGetPayload<{ select: typeof BUEIRO_SELECT }>;

function toNumber(value: Prisma.Decimal | null): number | null {
  return value === null ? null : Number(value);
}

function computeStatus(alertasAtivos: { nivel: string | null }[]): BueiroStatus {
  if (alertasAtivos.length === 0) return "normal";
  return alertasAtivos.some((alerta) => alerta.nivel === "CRITICO") ? "critical" : "warning";
}

function toBueiroDto(row: BueiroRow): BueiroDto {
  return {
    id: row.id,
    endereco: {
      id: row.enderecos.id,
      rua: row.enderecos.rua,
      numero: row.enderecos.numero,
      cep: row.enderecos.cep,
      latitude: toNumber(row.enderecos.latitude),
      longitude: toNumber(row.enderecos.longitude),
    },
    diametro: toNumber(row.diametro),
    profundidade: toNumber(row.profundidade),
    capacidade_fluxo: toNumber(row.capacidade_fluxo),
    data_instalacao: row.data_instalacao ? row.data_instalacao.toISOString() : null,
    status: computeStatus(row.alertas),
    alertas_ativos: row.alertas.length,
  };
}

export async function findAll(): Promise<BueiroDto[]> {
  const rows = await prisma.bueiros.findMany({ select: BUEIRO_SELECT });
  return rows.map(toBueiroDto);
}

export async function findById(id: number): Promise<BueiroDto | null> {
  const row = await prisma.bueiros.findUnique({ where: { id }, select: BUEIRO_SELECT });
  return row ? toBueiroDto(row) : null;
}

export async function create(data: CreateBueiroInput): Promise<BueiroDto> {
  const { rua, numero, cep, latitude, longitude, data_instalacao, ...rest } = data;

  const created = await prisma.$transaction(async (tx) => {
    const endereco = await tx.enderecos.create({
      data: { rua, numero, cep, latitude, longitude },
    });

    return tx.bueiros.create({
      data: {
        ...rest,
        endereco_id: endereco.id,
        ...(data_instalacao ? { data_instalacao: new Date(data_instalacao) } : {}),
      },
      select: BUEIRO_SELECT,
    });
  });

  return toBueiroDto(created);
}

const ENDERECO_FIELDS = ["rua", "numero", "cep", "latitude", "longitude"] as const;

export async function update(id: number, data: UpdateBueiroInput): Promise<BueiroDto | null> {
  const { rua, numero, cep, latitude, longitude, data_instalacao, ...rest } = data;

  const updated = await prisma.$transaction(async (tx) => {
    const bueiro = await tx.bueiros.findUnique({ where: { id } });
    if (!bueiro) return null;

    const hasEnderecoChanges = ENDERECO_FIELDS.some((field) => data[field] !== undefined);

    if (hasEnderecoChanges) {
      await tx.enderecos.update({
        where: { id: bueiro.endereco_id },
        data: { rua, numero, cep, latitude, longitude },
      });
    }

    return tx.bueiros.update({
      where: { id },
      data: {
        ...rest,
        ...(data_instalacao !== undefined
          ? {
              data_instalacao: data_instalacao ? new Date(data_instalacao) : null,
            }
          : {}),
      },
      select: BUEIRO_SELECT,
    });
  });

  return updated ? toBueiroDto(updated) : null;
}

export async function remove(id: number): Promise<BueiroDto | null> {
  const exists = await prisma.bueiros.findUnique({ where: { id } });
  if (!exists) return null;

  const removed = await prisma.bueiros.delete({ where: { id }, select: BUEIRO_SELECT });
  return toBueiroDto(removed);
}

const DASHBOARD_MONTHS_BACK = 6;
const OPEN_MANUTENCAO_STATUSES = ["ABERTA", "EM_ANDAMENTO"];

function monthKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

export async function getDashboard(id: number): Promise<BueiroDashboardDto | null> {
  const exists = await prisma.bueiros.findUnique({ where: { id } });
  if (!exists) return null;

  const since = new Date();
  since.setMonth(since.getMonth() - (DASHBOARD_MONTHS_BACK - 1), 1);
  since.setHours(0, 0, 0, 0);

  const [
    alertasAtivos,
    alertasTotal,
    sensoresAtivos,
    sensoresTotal,
    manutencoesAbertas,
    manutencoesTotal,
    alertasAtivosDetalhe,
    alertasRecentes,
  ] = await prisma.$transaction([
    prisma.alertas.count({ where: { bueiro_id: id, resolvido: false } }),
    prisma.alertas.count({ where: { bueiro_id: id } }),
    prisma.sensores.count({ where: { bueiro_id: id, status: "ATIVO" } }),
    prisma.sensores.count({ where: { bueiro_id: id } }),
    prisma.manutencao.count({
      where: { bueiro_id: id, status: { in: OPEN_MANUTENCAO_STATUSES } },
    }),
    prisma.manutencao.count({ where: { bueiro_id: id } }),
    prisma.alertas.findMany({
      where: { bueiro_id: id, resolvido: false },
      select: { nivel: true },
    }),
    prisma.alertas.findMany({
      where: { bueiro_id: id, data_hora: { gte: since } },
      select: { data_hora: true, tipos_alerta: { select: { nome: true } } },
    }),
  ]);

  const tipoTotals = new Map<string, number>();
  const monthBuckets = new Map<string, Map<string, number>>();

  for (let i = 0; i < DASHBOARD_MONTHS_BACK; i++) {
    const date = new Date(since);
    date.setMonth(date.getMonth() + i);
    monthBuckets.set(monthKey(date), new Map());
  }

  for (const alerta of alertasRecentes) {
    const tipo = alerta.tipos_alerta?.nome ?? "Outro";
    tipoTotals.set(tipo, (tipoTotals.get(tipo) ?? 0) + 1);

    const bucket = monthBuckets.get(monthKey(alerta.data_hora));
    bucket?.set(tipo, (bucket.get(tipo) ?? 0) + 1);
  }

  const alertas_por_tipo: AlertaPorTipoDto[] = Array.from(tipoTotals.entries()).map(
    ([tipo, total]) => ({ tipo, total }),
  );

  const alertas_por_mes: AlertaPorMesDto[] = Array.from(monthBuckets.entries()).map(
    ([mes, tipos]) => ({ mes, ...Object.fromEntries(tipos) }),
  );

  return {
    bueiro_id: id,
    status: computeStatus(alertasAtivosDetalhe),
    totals: {
      alertas_ativos: alertasAtivos,
      alertas_total: alertasTotal,
      sensores_ativos: sensoresAtivos,
      sensores_total: sensoresTotal,
      manutencoes_abertas: manutencoesAbertas,
      manutencoes_total: manutencoesTotal,
    },
    alertas_por_tipo,
    alertas_por_mes,
  };
}
