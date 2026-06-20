import prisma, { Prisma } from "@fossus/db";
import type { LeituraDto, PaginatedResult } from "@fossus/api-types";
import type { CreateLeituraInput } from "@/schemas/leituras";

function toLeituraDto(row: {
  id: bigint;
  sensor_id: number;
  valor: Prisma.Decimal;
  data_hora: Date;
}): LeituraDto {
  return {
    id: Number(row.id),
    sensor_id: row.sensor_id,
    valor: Number(row.valor),
    data_hora: row.data_hora.toISOString(),
  };
}

export async function create(data: CreateLeituraInput): Promise<LeituraDto> {
  const { sensor_id, valor, data_hora } = data;
  const created = await prisma.leituras.create({
    data: { sensor_id, valor, data_hora: new Date(data_hora) },
  });
  return toLeituraDto(created);
}

export async function findAll(page = 1, limit = 50): Promise<PaginatedResult<LeituraDto>> {
  const skip = (page - 1) * limit;

  const [rows, total] = await prisma.$transaction([
    prisma.leituras.findMany({
      skip,
      take: limit,
      orderBy: { data_hora: "desc" },
    }),
    prisma.leituras.count(),
  ]);

  return {
    data: rows.map(toLeituraDto),
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}
