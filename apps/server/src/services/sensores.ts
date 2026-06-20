import prisma, { Prisma } from "@fossus/db";
import type { SensorDto } from "@fossus/api-types";
import type { CreateSensorInput, UpdateSensorInput } from "@/schemas/sensores";

const SENSOR_SELECT = {
  id: true,
  bueiro_id: true,
  fabricante: true,
  numero_serie: true,
  data_instalacao: true,
  ultima_calibracao: true,
  status: true,
  tipos_sensor: {
    select: { id: true, nome: true, unidade: true },
  },
} as const;

type SensorRow = Prisma.sensoresGetPayload<{ select: typeof SENSOR_SELECT }>;

function toSensorDto(row: SensorRow): SensorDto {
  return {
    id: row.id,
    bueiro_id: row.bueiro_id,
    tipo_sensor: row.tipos_sensor,
    fabricante: row.fabricante,
    numero_serie: row.numero_serie,
    data_instalacao: row.data_instalacao ? row.data_instalacao.toISOString() : null,
    ultima_calibracao: row.ultima_calibracao ? row.ultima_calibracao.toISOString() : null,
    status: row.status,
  };
}

export async function create(data: CreateSensorInput): Promise<SensorDto> {
  const {
    bueiro_id,
    tipo_sensor_id,
    fabricante,
    numero_serie,
    data_instalacao,
    ultima_calibracao,
    status,
  } = data;

  const created = await prisma.sensores.create({
    data: {
      bueiro_id,
      tipo_sensor_id,
      fabricante,
      numero_serie,
      data_instalacao,
      ultima_calibracao,
      status,
    },
    select: SENSOR_SELECT,
  });

  return toSensorDto(created);
}

export async function update(id: number, data: UpdateSensorInput): Promise<SensorDto> {
  const updated = await prisma.sensores.update({
    where: { id },
    data: { ...data },
    select: SENSOR_SELECT,
  });

  return toSensorDto(updated);
}

export async function findAll(): Promise<SensorDto[]> {
  const rows = await prisma.sensores.findMany({ select: SENSOR_SELECT });
  return rows.map(toSensorDto);
}

export async function remove(id: number): Promise<SensorDto | null> {
  const exists = await prisma.sensores.findUnique({ where: { id } });

  if (!exists) return null;

  const removed = await prisma.sensores.delete({ where: { id }, select: SENSOR_SELECT });
  return toSensorDto(removed);
}

export async function findById(id: number): Promise<SensorDto | null> {
  const row = await prisma.sensores.findUnique({ where: { id }, select: SENSOR_SELECT });
  return row ? toSensorDto(row) : null;
}
