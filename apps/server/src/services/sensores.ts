import prisma from "@fossus/db";
import type { CreateSensorInput, UpdateSensorInput } from "@/schemas/sensores";

export async function create(data: CreateSensorInput) {
  const {
    bueiro_id,
    tipo_sensor_id,
    fabricante,
    numero_serie,
    data_instalacao,
    ultima_calibracao,
    status,
  } = data;
  return prisma.sensores.create({
    data: {
      bueiro_id,
      tipo_sensor_id,
      fabricante,
      numero_serie,
      data_instalacao,
      ultima_calibracao,
      status,
    },
  });
}

export async function update(id: number, data: UpdateSensorInput) {
  return prisma.sensores.update({
    where: { id },
    data: {
      ...data,
    },
    include: { bueiros: true, tipos_sensor: true },
  });
}

export async function findAll() {
  return prisma.sensores.findMany({
    include: {
      bueiros: true,
      tipos_sensor: true,
    },
  });
}

export async function remove(id: number) {
  const exists = await prisma.sensores.findUnique({ where: { id } });

  if (!exists) return null;

  return prisma.sensores.delete({
    where: { id },
  });
}

export async function findById(id: number) {
  return prisma.sensores.findUnique({
    where: { id },
    include: {
      tipos_sensor: true,
      bueiros: true,
    },
  });
}
