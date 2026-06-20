import prisma from "@fossus/db";
import type { CreateEquipeInput, UpdateEquipeInput } from "../schemas/equipes";

export async function create(data: CreateEquipeInput) {
  const { nome, telefones } = data;

  return prisma.$transaction(async (tx) => {
    const equipe = await tx.equipes.create({
      data: { nome },
    });

    if (telefones && telefones.length > 0) {
      const telefonesData = telefones.map((tel) => ({
        equipe_id: equipe.id,
        telefone: tel,
      }));

      await tx.telefones.createMany({
        data: telefonesData,
      });
    }

    return equipe;
  });
}

export async function findAll() {
  return prisma.equipes.findMany({
    include: {
      telefones: true,
    },
    orderBy: {
      nome: "asc",
    },
  });
}

export async function findById(id: number) {
  return prisma.equipes.findUnique({
    where: { id },
    include: {
      telefones: true,
    },
  });
}

export async function remove(id: number) {
  const exists = await prisma.equipes.findUnique({ where: { id } });

  if (!exists) return null;

  return prisma.equipes.delete({ where: { id } });
}

export async function update(id: number, data: UpdateEquipeInput) {
  const exists = await prisma.equipes.findUnique({
    where: { id },
  });

  if (!exists) return null;

  return prisma.$transaction(async (tx) => {
    await tx.equipes.update({
      where: { id },
      data: {
        nome: data.nome,
      },
    });

    if (data.telefones) {
      await tx.telefones.deleteMany({
        where: {
          equipe_id: id,
        },
      });

      if (data.telefones.length > 0) {
        await tx.telefones.createMany({
          data: data.telefones.map((telefone) => ({
            equipe_id: id,
            telefone,
          })),
        });
      }
    }

    return tx.equipes.findUnique({
      where: { id },
      include: {
        telefones: true,
      },
    });
  });
}
