import prisma, { Prisma } from "@fossus/db";
import type { EquipeDto } from "@fossus/api-types";
import type { CreateEquipeInput, UpdateEquipeInput } from "../schemas/equipes";

const EQUIPE_SELECT = {
  id: true,
  nome: true,
  telefones: { select: { telefone: true } },
} as const;

type EquipeRow = Prisma.equipesGetPayload<{ select: typeof EQUIPE_SELECT }>;

function toEquipeDto(row: EquipeRow): EquipeDto {
  return {
    id: row.id,
    nome: row.nome,
    telefones: row.telefones
      .map((telefone) => telefone.telefone)
      .filter((telefone): telefone is string => telefone !== null),
  };
}

export async function create(data: CreateEquipeInput): Promise<EquipeDto> {
  const { nome, telefones } = data;

  const created = await prisma.$transaction(async (tx) => {
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

    return tx.equipes.findUniqueOrThrow({
      where: { id: equipe.id },
      select: EQUIPE_SELECT,
    });
  });

  return toEquipeDto(created);
}

export async function findAll(): Promise<EquipeDto[]> {
  const rows = await prisma.equipes.findMany({
    select: EQUIPE_SELECT,
    orderBy: { nome: "asc" },
  });
  return rows.map(toEquipeDto);
}

export async function findById(id: number): Promise<EquipeDto | null> {
  const row = await prisma.equipes.findUnique({ where: { id }, select: EQUIPE_SELECT });
  return row ? toEquipeDto(row) : null;
}

export async function remove(id: number): Promise<EquipeDto | null> {
  const exists = await prisma.equipes.findUnique({ where: { id }, select: EQUIPE_SELECT });

  if (!exists) return null;

  await prisma.equipes.delete({ where: { id } });
  return toEquipeDto(exists);
}

export async function update(id: number, data: UpdateEquipeInput): Promise<EquipeDto | null> {
  const exists = await prisma.equipes.findUnique({
    where: { id },
  });

  if (!exists) return null;

  const updated = await prisma.$transaction(async (tx) => {
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

    return tx.equipes.findUniqueOrThrow({
      where: { id },
      select: EQUIPE_SELECT,
    });
  });

  return toEquipeDto(updated);
}
