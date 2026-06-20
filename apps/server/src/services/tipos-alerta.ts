import prisma from "@fossus/db";
import type { TipoAlertaDto } from "@fossus/api-types";
import type { CreateTipoAlertaInput, UpdateTipoAlertaInput } from "../schemas/tipos-alerta";

const TIPO_ALERTA_SELECT = { id: true, nome: true, descricao: true } as const;

export async function findAll(): Promise<TipoAlertaDto[]> {
  return prisma.tipos_alerta.findMany({
    select: TIPO_ALERTA_SELECT,
    orderBy: {
      nome: "asc",
    },
  });
}

export async function findById(id: number): Promise<TipoAlertaDto | null> {
  return prisma.tipos_alerta.findUnique({
    where: { id },
    select: TIPO_ALERTA_SELECT,
  });
}

export async function create(data: CreateTipoAlertaInput): Promise<TipoAlertaDto> {
  return prisma.tipos_alerta.create({
    data: {
      nome: data.nome,
      descricao: data.descricao,
    },
    select: TIPO_ALERTA_SELECT,
  });
}

export async function update(
  id: number,
  data: UpdateTipoAlertaInput,
): Promise<TipoAlertaDto | null> {
  const tipoAlerta = await findById(id);

  if (!tipoAlerta) {
    return null;
  }

  return prisma.tipos_alerta.update({
    where: { id },
    data: {
      ...(data.nome !== undefined && {
        nome: data.nome,
      }),
      ...(data.descricao !== undefined && {
        descricao: data.descricao,
      }),
    },
    select: TIPO_ALERTA_SELECT,
  });
}

export async function remove(id: number): Promise<TipoAlertaDto | null> {
  const tipoAlerta = await findById(id);

  if (!tipoAlerta) {
    return null;
  }

  await prisma.tipos_alerta.delete({
    where: { id },
  });

  return tipoAlerta;
}
