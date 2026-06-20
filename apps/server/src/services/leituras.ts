import prisma from "@fossus/db";
import type { CreateLeituraInput} from "@/schemas/leituras";


export async function create(data: CreateLeituraInput) {
    const {sensor_id, valor, data_hora} = data
    return prisma.leituras.create({
        data:{sensor_id, valor, data_hora: new Date(data_hora)}
    })
}
export async function findAll(page = 1, limit = 50) {
    const skip = (page - 1) * limit;

    const [data, total] = await prisma.$transaction([
        prisma.leituras.findMany({
            skip,
            take: limit,
            orderBy: { data_hora: 'desc' }
        }),
        prisma.leituras.count()
    ]);

    const dataFormatted = data.map(leitura => ({
        ...leitura,
        id: Number(leitura.id)
    }));

    return {
        data: dataFormatted,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
}
