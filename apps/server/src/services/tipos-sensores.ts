import prisma from "@fossus/db";
import type { TipoSensorDto } from "@fossus/api-types";

const TIPO_SENSOR_SELECT = { id: true, nome: true, unidade: true } as const;

export async function findAll(): Promise<TipoSensorDto[]> {
  return prisma.tipos_sensor.findMany({
    select: TIPO_SENSOR_SELECT,
    orderBy: {
      nome: "asc",
    },
  });
}
