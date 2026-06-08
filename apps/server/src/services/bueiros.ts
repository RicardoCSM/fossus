import prisma, { Prisma } from "@fossus/db";
import type { CreateBueiroInput, UpdateBueiroInput } from "../schemas/bueiros";

type BueiroWithEndereco = Prisma.bueirosGetPayload<{
  include: { enderecos: true };
}>;

const INCLUDE_ENDERECO = { enderecos: true } as const;

export function findAll(): Prisma.PrismaPromise<BueiroWithEndereco[]> {
  return prisma.bueiros.findMany({ include: INCLUDE_ENDERECO });
}

export function findById(id: number): Prisma.PrismaPromise<BueiroWithEndereco | null> {
  return prisma.bueiros.findUnique({
    where: { id },
    include: INCLUDE_ENDERECO,
  });
}

export async function create(data: CreateBueiroInput): Promise<BueiroWithEndereco> {
  const { rua, numero, cep, latitude, longitude, data_instalacao, ...rest } = data;

  return prisma.$transaction(async (tx) => {
    const endereco = await tx.enderecos.create({
      data: { rua, numero, cep, latitude, longitude },
    });

    return tx.bueiros.create({
      data: {
        ...rest,
        endereco_id: endereco.id,
        ...(data_instalacao ? { data_instalacao: new Date(data_instalacao) } : {}),
      },
      include: INCLUDE_ENDERECO,
    });
  });
}

const ENDERECO_FIELDS = ["rua", "numero", "cep", "latitude", "longitude"] as const;

export async function update(
  id: number,
  data: UpdateBueiroInput,
): Promise<BueiroWithEndereco | null> {
  const { rua, numero, cep, latitude, longitude, data_instalacao, ...rest } = data;

  return prisma.$transaction(async (tx) => {
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
      include: INCLUDE_ENDERECO,
    });
  });
}

export async function remove(id: number): Promise<BueiroWithEndereco | null> {
  const exists = await prisma.bueiros.findUnique({ where: { id } });
  if (!exists) return null;

  return prisma.bueiros.delete({ where: { id }, include: INCLUDE_ENDERECO });
}
