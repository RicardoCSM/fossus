import prisma from "@fossus/db";
import type {
  CreateTipoAlertaInput,
  UpdateTipoAlertaInput,
} from "../schemas/tipos-alerta";

export async function findAll() {
  return prisma.tipos_alerta.findMany({
    orderBy: {
      nome: "asc",
    },
  });
}

export async function findById(id: number) {
  return prisma.tipos_alerta.findUnique({
    where: { id },
  });
}

export async function create(data: CreateTipoAlertaInput) {
  return prisma.tipos_alerta.create({
    data: {
      nome: data.nome,
      descricao: data.descricao,
    },
  });
}

export async function update(id: number, data: UpdateTipoAlertaInput) {
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
  });
}

export async function remove(id: number) {
  const tipoAlerta = await findById(id);

  if (!tipoAlerta) {
    return null;
  }

  await prisma.tipos_alerta.delete({
    where: { id },
  });

  return tipoAlerta;
}
