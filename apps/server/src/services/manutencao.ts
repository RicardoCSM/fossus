import prisma from "@fossus/db";
import type {
  CreateManutencaoInput,
  UpdateManutencaoInput,
} from "../schemas/manutencao";

export async function findAll() {
  return prisma.manutencao.findMany({
    include: {
      bueiros: true,
      equipes: true,
    },
  });
}

export async function findById(id: number) {
  return prisma.manutencao.findUnique({
    where: { id },
    include: {
      bueiros: true,
      equipes: true,
    },
  });
}

export async function create(
  bueiroId: number,
  equipeId: number,
  data: CreateManutencaoInput
) {
  return prisma.manutencao.create({
    data: {
      bueiro_id: bueiroId,
      equipe_id: equipeId,

      data_abertura: data.data_abertura,
      data_execucao: data.data_manutencao,

      status: data.status,
      descricao: data.descricao,
    },
    include: {
      bueiros: true,
      equipes: true,
    },
  });
}

export async function update(
  id: number,
  data: UpdateManutencaoInput
) {
  const manutencao = await findById(id);

  if (!manutencao) {
    return null;
  }

  return prisma.manutencao.update({
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
    include: {
      bueiros: true,
      equipes: true,
    },
  });
}

export async function remove(id: number) {
  const manutencao = await findById(id);

  if (!manutencao) {
    return null;
  }

  await prisma.manutencao.delete({
    where: { id },
  });

  return manutencao;
}