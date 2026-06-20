import prisma from "@fossus/db";
import type { CreateAlertaInput, UpdateAlertaInput } from "../schemas/alertas";

export async function findAll(page = 1, limit = 50) {
  const skip = (page - 1) * limit;

  const [data, total] = await prisma.$transaction([
    prisma.alertas.findMany({
      skip,
      take: limit,
      include: {
        bueiros: true,
        tipos_alerta: true,
      },
      orderBy: { data_hora: "desc" },
    }),
    prisma.alertas.count(),
  ]);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function findById(id: number) {
  return prisma.alertas.findUnique({
    where: { id },
    include: {
      bueiros: true,
      tipos_alerta: true,
    },
  });
}

export async function create(data: CreateAlertaInput) {
  return prisma.alertas.create({
    data: {
      bueiro_id: data.bueiro_id,
      tipo_alerta_id: data.tipo_alerta_id,
      data_hora: data.data_hora,
      nivel: data.nivel,
      descricao: data.descricao,
      resolvido: false,
    },
    include: {
      bueiros: true,
      tipos_alerta: true,
    },
  });
}

export async function update(id: number, data: UpdateAlertaInput) {
  const alerta = await findById(id);

  if (!alerta) {
    return null;
  }

  return prisma.alertas.update({
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
    include: {
      bueiros: true,
      tipos_alerta: true,
    },
  });
}

export async function findByBueiroId(bueiroId: number, page = 1, limit = 50) {
  const skip = (page - 1) * limit;

  const [data, total] = await prisma.$transaction([
    prisma.alertas.findMany({
      where: { bueiro_id: bueiroId },
      skip,
      take: limit,
      include: {
        tipos_alerta: true,
        bueiros: true,
      },
      orderBy: { data_hora: "desc" },
    }),
    prisma.alertas.count({ where: { bueiro_id: bueiroId } }),
  ]);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}
