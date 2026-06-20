import prisma from "@fossus/db";

export async function findAll() {
  return prisma.tipos_sensor.findMany({
    orderBy: {
      nome: "asc",
    },
  });
}