import prisma, { Prisma } from "@fossus/db";
import type { ManutencaoDto } from "@fossus/api-types";
import type { CreateManutencaoInput, UpdateManutencaoInput } from "../schemas/manutencao";

const MANUTENCAO_SELECT = {
  id: true,
  data_abertura: true,
  data_execucao: true,
  status: true,
  descricao: true,
  bueiros: {
    select: {
      id: true,
      enderecos: { select: { rua: true, numero: true } },
    },
  },
  equipes: {
    select: { id: true, nome: true },
  },
} as const;

type ManutencaoRow = Prisma.manutencaoGetPayload<{ select: typeof MANUTENCAO_SELECT }>;

function toManutencaoDto(row: ManutencaoRow): ManutencaoDto {
  return {
    id: row.id,
    bueiro: {
      id: row.bueiros.id,
      rua: row.bueiros.enderecos.rua,
      numero: row.bueiros.enderecos.numero,
    },
    equipe: { id: row.equipes.id, nome: row.equipes.nome },
    data_abertura: row.data_abertura ? row.data_abertura.toISOString() : null,
    data_execucao: row.data_execucao ? row.data_execucao.toISOString() : null,
    status: row.status,
    descricao: row.descricao,
  };
}

export async function findAll(): Promise<ManutencaoDto[]> {
  const rows = await prisma.manutencao.findMany({ select: MANUTENCAO_SELECT });
  return rows.map(toManutencaoDto);
}

export async function findById(id: number): Promise<ManutencaoDto | null> {
  const row = await prisma.manutencao.findUnique({ where: { id }, select: MANUTENCAO_SELECT });
  return row ? toManutencaoDto(row) : null;
}

export async function findByBueiroId(bueiroId: number): Promise<ManutencaoDto[]> {
  const rows = await prisma.manutencao.findMany({
    where: { bueiro_id: bueiroId },
    select: MANUTENCAO_SELECT,
  });
  return rows.map(toManutencaoDto);
}

export async function create(
  bueiroId: number,
  equipeId: number,
  data: CreateManutencaoInput,
): Promise<ManutencaoDto> {
  const created = await prisma.manutencao.create({
    data: {
      bueiro_id: bueiroId,
      equipe_id: equipeId,

      data_abertura: data.data_abertura,
      data_execucao: data.data_manutencao,

      status: data.status,
      descricao: data.descricao,
    },
    select: MANUTENCAO_SELECT,
  });

  return toManutencaoDto(created);
}

export async function update(
  id: number,
  data: UpdateManutencaoInput,
): Promise<ManutencaoDto | null> {
  const exists = await prisma.manutencao.findUnique({ where: { id } });

  if (!exists) {
    return null;
  }

  const updated = await prisma.manutencao.update({
    where: { id },
    data: {
      ...(data.data_abertura !== undefined && {
        data_abertura: data.data_abertura,
      }),

      ...(data.data_manutencao !== undefined && {
        data_execucao: data.data_manutencao,
      }),

      ...(data.status !== undefined && {
        status: data.status,
      }),

      ...(data.descricao !== undefined && {
        descricao: data.descricao,
      }),
    },
    select: MANUTENCAO_SELECT,
  });

  return toManutencaoDto(updated);
}

export async function remove(id: number): Promise<ManutencaoDto | null> {
  const manutencao = await findById(id);

  if (!manutencao) {
    return null;
  }

  await prisma.manutencao.delete({
    where: { id },
  });

  return manutencao;
}
