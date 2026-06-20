import prisma, { Prisma } from "@fossus/db";
import type { AlertaDto, PaginatedResult } from "@fossus/api-types";
import type { CreateAlertaInput, UpdateAlertaInput } from "../schemas/alertas";

const ALERTA_SELECT = {
  id: true,
  data_hora: true,
  nivel: true,
  descricao: true,
  resolvido: true,
  bueiros: {
    select: {
      id: true,
      enderecos: { select: { rua: true, numero: true } },
    },
  },
  tipos_alerta: {
    select: { id: true, nome: true, descricao: true },
  },
} as const;

type AlertaRow = Prisma.alertasGetPayload<{ select: typeof ALERTA_SELECT }>;

function toAlertaDto(row: AlertaRow): AlertaDto {
  return {
    id: row.id,
    bueiro: {
      id: row.bueiros.id,
      rua: row.bueiros.enderecos.rua,
      numero: row.bueiros.enderecos.numero,
    },
    tipo_alerta: row.tipos_alerta,
    data_hora: row.data_hora.toISOString(),
    nivel: row.nivel,
    descricao: row.descricao,
    resolvido: row.resolvido ?? false,
  };
}

export async function findAll(page = 1, limit = 50): Promise<PaginatedResult<AlertaDto>> {
  const skip = (page - 1) * limit;

  const [rows, total] = await prisma.$transaction([
    prisma.alertas.findMany({
      skip,
      take: limit,
      select: ALERTA_SELECT,
      orderBy: { data_hora: "desc" },
    }),
    prisma.alertas.count(),
  ]);

  return {
    data: rows.map(toAlertaDto),
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function findById(id: number): Promise<AlertaDto | null> {
  const row = await prisma.alertas.findUnique({ where: { id }, select: ALERTA_SELECT });
  return row ? toAlertaDto(row) : null;
}

export async function create(data: CreateAlertaInput): Promise<AlertaDto> {
  const created = await prisma.alertas.create({
    data: {
      bueiro_id: data.bueiro_id,
      tipo_alerta_id: data.tipo_alerta_id,
      data_hora: data.data_hora,
      nivel: data.nivel,
      descricao: data.descricao,
      resolvido: false,
    },
    select: ALERTA_SELECT,
  });

  return toAlertaDto(created);
}

export async function update(id: number, data: UpdateAlertaInput): Promise<AlertaDto | null> {
  const exists = await prisma.alertas.findUnique({ where: { id } });

  if (!exists) {
    return null;
  }

  const updated = await prisma.alertas.update({
    where: { id },
    data: {
      ...(data.resolvido !== undefined && {
        resolvido: data.resolvido,
      }),
      ...(data.nivel !== undefined && {
        nivel: data.nivel,
      }),
      ...(data.descricao !== undefined && {
        descricao: data.descricao,
      }),
    },
    select: ALERTA_SELECT,
  });

  return toAlertaDto(updated);
}

export async function findByBueiroId(
  bueiroId: number,
  page = 1,
  limit = 50,
): Promise<PaginatedResult<AlertaDto>> {
  const skip = (page - 1) * limit;

  const [rows, total] = await prisma.$transaction([
    prisma.alertas.findMany({
      where: { bueiro_id: bueiroId },
      skip,
      take: limit,
      select: ALERTA_SELECT,
      orderBy: { data_hora: "desc" },
    }),
    prisma.alertas.count({ where: { bueiro_id: bueiroId } }),
  ]);

  return {
    data: rows.map(toAlertaDto),
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}
