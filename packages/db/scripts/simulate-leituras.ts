import prisma from "@fossus/db";

interface RangeConfig {
  min: number;
  max: number;
  volatility: number;
}

const DEFAULT_RANGE: RangeConfig = { min: 0, max: 100, volatility: 10 };

const RANGES_BY_TIPO: Record<string, RangeConfig> = {
  chuva: { min: 0, max: 80, volatility: 8 },
  vazao: { min: 30, max: 400, volatility: 25 },
  sedimento: { min: 0, max: 100, volatility: 6 },
  "nivel da agua": { min: 0, max: 200, volatility: 15 },
};

const INTERVAL_MS = Number(process.env.SIMULATE_INTERVAL_MS ?? 5000);

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function rangeFor(tipoNome: string): RangeConfig {
  return RANGES_BY_TIPO[normalize(tipoNome)] ?? DEFAULT_RANGE;
}

const lastValues = new Map<number, number>();

function nextValue(sensorId: number, range: RangeConfig): number {
  const previous = lastValues.get(sensorId) ?? (range.min + range.max) / 2;
  const delta = (Math.random() * 2 - 1) * range.volatility;
  const next = Math.min(range.max, Math.max(range.min, previous + delta));
  lastValues.set(sensorId, next);
  return Math.round(next * 100) / 100;
}

async function tick(): Promise<void> {
  const sensores = await prisma.sensores.findMany({
    where: { status: "ATIVO" },
    select: {
      id: true,
      numero_serie: true,
      tipos_sensor: { select: { nome: true, unidade: true } },
    },
  });

  if (sensores.length === 0) {
    console.warn("Nenhum sensor ATIVO encontrado — nada para simular.");
    return;
  }

  const agora = new Date();
  const leituras = sensores.map((sensor) => ({
    sensor_id: sensor.id,
    valor: nextValue(sensor.id, rangeFor(sensor.tipos_sensor.nome)),
    data_hora: agora,
  }));

  await prisma.leituras.createMany({ data: leituras });

  const resumo = sensores
    .map((sensor, i) => {
      const leitura = leituras[i];
      const label = sensor.numero_serie ?? `#${sensor.id}`;
      return `${label}=${leitura?.valor}${sensor.tipos_sensor.unidade}`;
    })
    .join(", ");

  console.log(`[${agora.toLocaleTimeString("pt-BR")}] ${leituras.length} leitura(s): ${resumo}`);
}

async function main(): Promise<void> {
  console.log(`Simulador de leituras iniciado (intervalo: ${INTERVAL_MS}ms). Ctrl+C para parar.`);

  await tick().catch((error: unknown) => console.error("Erro ao gerar leituras:", error));

  const interval = setInterval(() => {
    tick().catch((error: unknown) => console.error("Erro ao gerar leituras:", error));
  }, INTERVAL_MS);

  const shutdown = async () => {
    clearInterval(interval);
    await prisma.$disconnect();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main();
