import prisma, { Prisma } from "@fossus/db";
import type { BueiroDto, BueiroStatus } from "@fossus/api-types";
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
