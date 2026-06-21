import prisma from "@fossus/db";

async function clear() {
  await prisma.alertas.deleteMany();
  await prisma.manutencao.deleteMany();
  await prisma.leituras.deleteMany();
  await prisma.sensores.deleteMany();
  await prisma.telefones.deleteMany();
  await prisma.equipes.deleteMany();
  await prisma.tipos_alerta.deleteMany();
  await prisma.bueiros.deleteMany();
  await prisma.enderecos.deleteMany();
  await prisma.tipos_sensor.deleteMany();
}

async function seedTiposSensor() {
  const data = [
    { nome: "Chuva", unidade: "mm" },
    { nome: "Vazão", unidade: "L/s" },
    { nome: "Sedimento", unidade: "cm" },
    { nome: "Nível da Água", unidade: "cm" },
  ];

  const tiposSensor = [];
  for (const item of data) {
    tiposSensor.push(await prisma.tipos_sensor.create({ data: item }));
  }
  return tiposSensor;
}

async function seedEnderecos() {
  const data = [
    {
      rua: "Praça Cesário Alvim",
      numero: 1,
      cep: "35300010",
      latitude: -19.7903,
      longitude: -42.1398,
    },
    {
      rua: "Terminal Rodoviário",
      numero: 2,
      cep: "35300011",
      latitude: -19.7892,
      longitude: -42.1465,
    },
    {
      rua: "Hospital Nossa Senhora Auxiliadora",
      numero: 3,
      cep: "35300012",
      latitude: -19.7948,
      longitude: -42.1372,
    },
    {
      rua: "Centro Comercial",
      numero: 4,
      cep: "35300013",
      latitude: -19.7874,
      longitude: -42.1414,
    },
    {
      rua: "Praça da Estação",
      numero: 5,
      cep: "35300014",
      latitude: -19.7921,
      longitude: -42.1443,
    },
    {
      rua: "Bairro Limoeiro",
      numero: 6,
      cep: "35300015",
      latitude: -19.7869,
      longitude: -42.1337,
    },
    {
      rua: "Shopping Caratinga",
      numero: 7,
      cep: "35300016",
      latitude: -19.7954,
      longitude: -42.1481,
    },
    {
      rua: "Campus UNEC",
      numero: 8,
      cep: "35300017",
      latitude: -19.7928,
      longitude: -42.1308,
    },
    {
      rua: "Distrito Industrial",
      numero: 9,
      cep: "35300018",
      latitude: -19.7841,
      longitude: -42.1512,
    },
    {
      rua: "Parque de Exposições",
      numero: 10,
      cep: "35300019",
      latitude: -19.7992,
      longitude: -42.1365,
    },
    {
      rua: "Bairro Santa Zita",
      numero: 11,
      cep: "35300020",
      latitude: -19.7897,
      longitude: -42.1279,
    },
  ];

  const enderecos = [];
  for (const item of data) {
    enderecos.push(await prisma.enderecos.create({ data: item }));
  }
  return enderecos;
}

async function seedBueiros(enderecos: { id: number }[]) {
  const data = [
    {
      enderecoIndex: 0,
      diametro: 80,
      profundidade: 100,
      capacidade_fluxo: 250,
      data_instalacao: "2025-01-10",
    },
    {
      enderecoIndex: 1,
      diametro: 90,
      profundidade: 110,
      capacidade_fluxo: 260,
      data_instalacao: "2025-01-12",
    },
    {
      enderecoIndex: 2,
      diametro: 100,
      profundidade: 130,
      capacidade_fluxo: 300,
      data_instalacao: "2025-01-15",
    },
    {
      enderecoIndex: 3,
      diametro: 85,
      profundidade: 105,
      capacidade_fluxo: 240,
      data_instalacao: "2025-01-18",
    },
    {
      enderecoIndex: 4,
      diametro: 95,
      profundidade: 120,
      capacidade_fluxo: 280,
      data_instalacao: "2025-01-20",
    },
    {
      enderecoIndex: 5,
      diametro: 70,
      profundidade: 90,
      capacidade_fluxo: 200,
      data_instalacao: "2025-02-01",
    },
    {
      enderecoIndex: 6,
      diametro: 100,
      profundidade: 140,
      capacidade_fluxo: 320,
      data_instalacao: "2025-02-05",
    },
    {
      enderecoIndex: 7,
      diametro: 90,
      profundidade: 115,
      capacidade_fluxo: 270,
      data_instalacao: "2025-02-10",
    },
    {
      enderecoIndex: 8,
      diametro: 110,
      profundidade: 150,
      capacidade_fluxo: 350,
      data_instalacao: "2025-02-15",
    },
    {
      enderecoIndex: 9,
      diametro: 75,
      profundidade: 95,
      capacidade_fluxo: 220,
      data_instalacao: "2025-02-20",
    },
    {
      enderecoIndex: 10,
      diametro: 85,
      profundidade: 110,
      capacidade_fluxo: 260,
      data_instalacao: "2025-02-25",
    },
  ];

  const bueiros = [];
  for (const item of data) {
    const endereco = enderecos[item.enderecoIndex];
    if (!endereco) throw new Error(`Missing endereco at index ${item.enderecoIndex}`);
    bueiros.push(
      await prisma.bueiros.create({
        data: {
          endereco_id: endereco.id,
          diametro: item.diametro,
          profundidade: item.profundidade,
          capacidade_fluxo: item.capacidade_fluxo,
          data_instalacao: new Date(item.data_instalacao),
        },
      }),
    );
  }
  return bueiros;
}

async function seedSensores(bueiros: { id: number }[], tiposSensor: { id: number }[]) {
  const CHUVA = 0;
  const NIVEL_AGUA = 3;

  const data = [
    {
      bueiroIndex: 0,
      tipoIndex: CHUVA,
      fabricante: "Intelbras",
      numero_serie: "CH0101",
      data_instalacao: "2025-01-10",
    },
    {
      bueiroIndex: 0,
      tipoIndex: NIVEL_AGUA,
      fabricante: "Intelbras",
      numero_serie: "NV0101",
      data_instalacao: "2025-01-10",
    },
    {
      bueiroIndex: 1,
      tipoIndex: CHUVA,
      fabricante: "Bosch",
      numero_serie: "CH0102",
      data_instalacao: "2025-01-12",
    },
    {
      bueiroIndex: 1,
      tipoIndex: NIVEL_AGUA,
      fabricante: "Bosch",
      numero_serie: "NV0102",
      data_instalacao: "2025-01-12",
    },
    {
      bueiroIndex: 2,
      tipoIndex: CHUVA,
      fabricante: "Siemens",
      numero_serie: "CH0103",
      data_instalacao: "2025-01-15",
    },
    {
      bueiroIndex: 2,
      tipoIndex: NIVEL_AGUA,
      fabricante: "Siemens",
      numero_serie: "NV0103",
      data_instalacao: "2025-01-15",
    },
    {
      bueiroIndex: 3,
      tipoIndex: CHUVA,
      fabricante: "Intelbras",
      numero_serie: "CH0104",
      data_instalacao: "2025-01-18",
    },
    {
      bueiroIndex: 3,
      tipoIndex: NIVEL_AGUA,
      fabricante: "Intelbras",
      numero_serie: "NV0104",
      data_instalacao: "2025-01-18",
    },
    {
      bueiroIndex: 4,
      tipoIndex: CHUVA,
      fabricante: "Bosch",
      numero_serie: "CH0105",
      data_instalacao: "2025-01-20",
    },
    {
      bueiroIndex: 4,
      tipoIndex: NIVEL_AGUA,
      fabricante: "Bosch",
      numero_serie: "NV0105",
      data_instalacao: "2025-01-20",
    },
    {
      bueiroIndex: 5,
      tipoIndex: CHUVA,
      fabricante: "Siemens",
      numero_serie: "CH0106",
      data_instalacao: "2025-02-01",
    },
    {
      bueiroIndex: 5,
      tipoIndex: NIVEL_AGUA,
      fabricante: "Siemens",
      numero_serie: "NV0106",
      data_instalacao: "2025-02-01",
    },
    {
      bueiroIndex: 6,
      tipoIndex: CHUVA,
      fabricante: "Intelbras",
      numero_serie: "CH0107",
      data_instalacao: "2025-02-05",
    },
    {
      bueiroIndex: 6,
      tipoIndex: NIVEL_AGUA,
      fabricante: "Intelbras",
      numero_serie: "NV0107",
      data_instalacao: "2025-02-05",
    },
    {
      bueiroIndex: 7,
      tipoIndex: CHUVA,
      fabricante: "Bosch",
      numero_serie: "CH0108",
      data_instalacao: "2025-02-10",
    },
    {
      bueiroIndex: 7,
      tipoIndex: NIVEL_AGUA,
      fabricante: "Bosch",
      numero_serie: "NV0108",
      data_instalacao: "2025-02-10",
    },
    {
      bueiroIndex: 8,
      tipoIndex: CHUVA,
      fabricante: "Siemens",
      numero_serie: "CH0109",
      data_instalacao: "2025-02-15",
    },
    {
      bueiroIndex: 8,
      tipoIndex: NIVEL_AGUA,
      fabricante: "Siemens",
      numero_serie: "NV0109",
      data_instalacao: "2025-02-15",
    },
    {
      bueiroIndex: 9,
      tipoIndex: CHUVA,
      fabricante: "Intelbras",
      numero_serie: "CH0110",
      data_instalacao: "2025-02-20",
    },
    {
      bueiroIndex: 9,
      tipoIndex: NIVEL_AGUA,
      fabricante: "Intelbras",
      numero_serie: "NV0110",
      data_instalacao: "2025-02-20",
    },
    {
      bueiroIndex: 10,
      tipoIndex: CHUVA,
      fabricante: "Bosch",
      numero_serie: "CH0111",
      data_instalacao: "2025-02-25",
    },
    {
      bueiroIndex: 10,
      tipoIndex: NIVEL_AGUA,
      fabricante: "Bosch",
      numero_serie: "NV0111",
      data_instalacao: "2025-02-25",
    },
  ];

  const sensores = [];
  for (const item of data) {
    const bueiro = bueiros[item.bueiroIndex];
    const tipoSensor = tiposSensor[item.tipoIndex];
    if (!bueiro) throw new Error(`Missing bueiro at index ${item.bueiroIndex}`);
    if (!tipoSensor) throw new Error(`Missing tipo_sensor at index ${item.tipoIndex}`);
    sensores.push(
      await prisma.sensores.create({
        data: {
          bueiro_id: bueiro.id,
          tipo_sensor_id: tipoSensor.id,
          fabricante: item.fabricante,
          numero_serie: item.numero_serie,
          data_instalacao: new Date(item.data_instalacao),
          ultima_calibracao: new Date("2026-01-01"),
          status: "ATIVO",
        },
      }),
    );
  }
  return sensores;
}

async function seedEquipes() {
  const nomes = ["Equipe Centro", "Equipe Norte", "Equipe Emergencial"];

  const equipes = [];
  for (const nome of nomes) {
    equipes.push(await prisma.equipes.create({ data: { nome } }));
  }
  return equipes;
}

async function seedTelefones(equipes: { id: number }[]) {
  const telefones = ["(33)99999-1001", "(33)99999-1002", "(33)99999-1003"];

  for (const [index, telefone] of telefones.entries()) {
    const equipe = equipes[index];
    if (!equipe) throw new Error(`Missing equipe at index ${index}`);
    await prisma.telefones.create({ data: { equipe_id: equipe.id, telefone } });
  }
}

async function seedLeituras(sensores: { id: number }[]) {
  const data = [
    // Histórico - alguns meses anteriores
    { sensorIndex: 1, valor: 18.0, data_hora: "2026-01-08 07:30:00" },
    { sensorIndex: 11, valor: 30.5, data_hora: "2026-02-11 14:20:00" },
    { sensorIndex: 5, valor: 65.0, data_hora: "2026-03-02 13:00:00" },
    { sensorIndex: 9, valor: 28.0, data_hora: "2026-04-12 15:15:00" },
    { sensorIndex: 17, valor: 80.0, data_hora: "2026-05-13 16:00:00" },
    { sensorIndex: 13, valor: 19.5, data_hora: "2026-05-20 11:30:00" },

    // Bueiro 1
    { sensorIndex: 1, valor: 22.5, data_hora: "2026-06-01 08:00:00" },
    { sensorIndex: 1, valor: 35.0, data_hora: "2026-06-01 09:00:00" },
    // Bueiro 3 (crítico)
    { sensorIndex: 5, valor: 88.0, data_hora: "2026-06-01 09:00:00" },
    { sensorIndex: 5, valor: 95.0, data_hora: "2026-06-01 10:00:00" },
    // Bueiro 5 (warning)
    { sensorIndex: 9, valor: 70.0, data_hora: "2026-06-01 09:00:00" },
    // Bueiro 9 (crítico)
    { sensorIndex: 17, valor: 92.0, data_hora: "2026-06-01 10:00:00" },
  ];

  for (const item of data) {
    const sensor = sensores[item.sensorIndex];
    if (!sensor) throw new Error(`Missing sensor at index ${item.sensorIndex}`);
    await prisma.leituras.create({
      data: {
        sensor_id: sensor.id,
        valor: item.valor,
        data_hora: new Date(item.data_hora.replace(" ", "T")),
      },
    });
  }
}

async function seedManutencao(bueiros: { id: number }[], equipes: { id: number }[]) {
  const data = [
    // Janeiro
    {
      bueiroIndex: 0,
      equipeIndex: 0,
      data_abertura: "2026-01-05 08:00:00",
      data_execucao: "2026-01-06 14:00:00",
      status: "CONCLUIDA",
      descricao: "Limpeza preventiva de rotina",
    },
    {
      bueiroIndex: 5,
      equipeIndex: 1,
      data_abertura: "2026-01-20 09:00:00",
      data_execucao: "2026-01-21 11:00:00",
      status: "CONCLUIDA",
      descricao: "Desobstrução de bueiro",
    },

    // Fevereiro
    {
      bueiroIndex: 3,
      equipeIndex: 0,
      data_abertura: "2026-02-10 08:30:00",
      data_execucao: "2026-02-11 10:15:00",
      status: "CONCLUIDA",
      descricao: "Inspeção de rotina",
    },
    {
      bueiroIndex: 9,
      equipeIndex: 2,
      data_abertura: "2026-02-15 13:00:00",
      data_execucao: null,
      status: "CANCELADA",
      descricao: "Cancelada - acesso bloqueado",
    },

    // Março
    {
      bueiroIndex: 1,
      equipeIndex: 1,
      data_abertura: "2026-03-05 09:00:00",
      data_execucao: "2026-03-06 12:30:00",
      status: "CONCLUIDA",
      descricao: "Troca de sensor de vazão",
    },
    {
      bueiroIndex: 6,
      equipeIndex: 0,
      data_abertura: "2026-03-18 07:45:00",
      data_execucao: "2026-03-19 09:50:00",
      status: "CONCLUIDA",
      descricao: "Limpeza de sedimentos",
    },

    // Abril
    {
      bueiroIndex: 4,
      equipeIndex: 2,
      data_abertura: "2026-04-02 10:00:00",
      data_execucao: "2026-04-03 15:20:00",
      status: "CONCLUIDA",
      descricao: "Reparo estrutural",
    },
    {
      bueiroIndex: 7,
      equipeIndex: 1,
      data_abertura: "2026-04-22 08:15:00",
      data_execucao: "2026-04-23 11:00:00",
      status: "CONCLUIDA",
      descricao: "Calibração de sensores",
    },

    // Maio
    {
      bueiroIndex: 0,
      equipeIndex: 0,
      data_abertura: "2026-05-08 08:00:00",
      data_execucao: "2026-05-09 10:40:00",
      status: "CONCLUIDA",
      descricao: "Inspeção preventiva mensal",
    },
    {
      bueiroIndex: 10,
      equipeIndex: 1,
      data_abertura: "2026-05-25 14:00:00",
      data_execucao: null,
      status: "EM_ANDAMENTO",
      descricao: "Avaliação de capacidade de fluxo reduzida",
    },

    // Junho
    {
      bueiroIndex: 2,
      equipeIndex: 2,
      data_abertura: "2026-06-01 10:30:00",
      data_execucao: null,
      status: "EM_ANDAMENTO",
      descricao: "Risco de transbordamento - inspeção urgente",
    },
    {
      bueiroIndex: 8,
      equipeIndex: 2,
      data_abertura: "2026-06-01 11:00:00",
      data_execucao: null,
      status: "ABERTA",
      descricao: "Possível obstrução severa",
    },
    {
      bueiroIndex: 5,
      equipeIndex: 0,
      data_abertura: "2026-06-10 09:20:00",
      data_execucao: null,
      status: "ABERTA",
      descricao: "Verificação de alerta de nível alto",
    },
  ];

  for (const item of data) {
    const bueiro = bueiros[item.bueiroIndex];
    const equipe = equipes[item.equipeIndex];
    if (!bueiro) throw new Error(`Missing bueiro at index ${item.bueiroIndex}`);
    if (!equipe) throw new Error(`Missing equipe at index ${item.equipeIndex}`);
    await prisma.manutencao.create({
      data: {
        bueiro_id: bueiro.id,
        equipe_id: equipe.id,
        data_abertura: new Date(item.data_abertura.replace(" ", "T")),
        data_execucao: item.data_execucao ? new Date(item.data_execucao.replace(" ", "T")) : null,
        status: item.status,
        descricao: item.descricao,
      },
    });
  }
}

async function seedTiposAlerta() {
  const data = [
    { nome: "OBSTRUÇÃO", descricao: "Obstrução crítica do bueiro" },
    { nome: "ALAGAMENTO", descricao: "Risco ou ocorrência de alagamento" },
    { nome: "VAZÃO_BAIXA", descricao: "Redução da capacidade de escoamento" },
    { nome: "SENSOR_OFFLINE", descricao: "Sensor sem comunicação" },
  ];

  const tiposAlerta = [];
  for (const item of data) {
    tiposAlerta.push(await prisma.tipos_alerta.create({ data: item }));
  }
  return tiposAlerta;
}

async function seedAlertas(bueiros: { id: number }[], tiposAlerta: { id: number }[]) {
  const OBSTRUCAO = 0;
  const ALAGAMENTO = 1;
  const VAZAO_BAIXA = 2;
  const SENSOR_OFFLINE = 3;

  // Alertas ativos atuais - definem o status exibido no mapa (crítico/atenção)
  const ativos = [
    {
      bueiroIndex: 2,
      data_hora: "2026-06-01 10:00:00",
      nivel: "CRITICO",
      descricao: "Nível de água crítico - risco de transbordamento",
      tipoIndex: ALAGAMENTO,
      resolvido: false,
    },
    {
      bueiroIndex: 4,
      data_hora: "2026-06-01 09:30:00",
      nivel: "ALTO",
      descricao: "Acúmulo de sedimentos elevado",
      tipoIndex: OBSTRUCAO,
      resolvido: false,
    },
    {
      bueiroIndex: 8,
      data_hora: "2026-06-01 10:15:00",
      nivel: "CRITICO",
      descricao: "Possível obstrução total detectada",
      tipoIndex: OBSTRUCAO,
      resolvido: false,
    },
    {
      bueiroIndex: 10,
      data_hora: "2026-06-01 09:50:00",
      nivel: "ALTO",
      descricao: "Nível de água elevado",
      tipoIndex: ALAGAMENTO,
      resolvido: false,
    },
  ];

  // Histórico de alertas já resolvidos, espalhado pelos últimos meses,
  // cobrindo todos os tipos e níveis para alimentar os gráficos do dashboard.
  const historico = [
    // Janeiro
    {
      bueiroIndex: 0,
      data_hora: "2026-01-08 07:40:00",
      nivel: "MEDIO",
      descricao: "Chuva forte detectada",
      tipoIndex: ALAGAMENTO,
      resolvido: true,
    },
    {
      bueiroIndex: 3,
      data_hora: "2026-01-14 16:20:00",
      nivel: "BAIXO",
      descricao: "Pequeno acúmulo de folhas",
      tipoIndex: OBSTRUCAO,
      resolvido: true,
    },
    {
      bueiroIndex: 6,
      data_hora: "2026-01-19 11:05:00",
      nivel: "ALTO",
      descricao: "Redução na vazão registrada",
      tipoIndex: VAZAO_BAIXA,
      resolvido: true,
    },
    {
      bueiroIndex: 9,
      data_hora: "2026-01-27 08:50:00",
      nivel: "MEDIO",
      descricao: "Sensor de nível intermitente",
      tipoIndex: SENSOR_OFFLINE,
      resolvido: true,
    },

    // Fevereiro
    {
      bueiroIndex: 1,
      data_hora: "2026-02-03 09:10:00",
      nivel: "ALTO",
      descricao: "Obstrução parcial por sedimentos",
      tipoIndex: OBSTRUCAO,
      resolvido: true,
    },
    {
      bueiroIndex: 5,
      data_hora: "2026-02-11 14:35:00",
      nivel: "CRITICO",
      descricao: "Transbordamento em andamento",
      tipoIndex: ALAGAMENTO,
      resolvido: true,
    },
    {
      bueiroIndex: 7,
      data_hora: "2026-02-18 10:00:00",
      nivel: "BAIXO",
      descricao: "Vazão levemente abaixo do esperado",
      tipoIndex: VAZAO_BAIXA,
      resolvido: true,
    },
    {
      bueiroIndex: 10,
      data_hora: "2026-02-24 06:55:00",
      nivel: "MEDIO",
      descricao: "Sensor de chuva offline",
      tipoIndex: SENSOR_OFFLINE,
      resolvido: true,
    },

    // Março
    {
      bueiroIndex: 2,
      data_hora: "2026-03-02 13:15:00",
      nivel: "MEDIO",
      descricao: "Acúmulo de detritos após chuva",
      tipoIndex: OBSTRUCAO,
      resolvido: true,
    },
    {
      bueiroIndex: 4,
      data_hora: "2026-03-09 17:40:00",
      nivel: "ALTO",
      descricao: "Nível de água subindo rapidamente",
      tipoIndex: ALAGAMENTO,
      resolvido: true,
    },
    {
      bueiroIndex: 8,
      data_hora: "2026-03-16 08:25:00",
      nivel: "BAIXO",
      descricao: "Vazão reduzida por entupimento leve",
      tipoIndex: VAZAO_BAIXA,
      resolvido: true,
    },
    {
      bueiroIndex: 0,
      data_hora: "2026-03-23 12:00:00",
      nivel: "CRITICO",
      descricao: "Sensor de nível sem comunicação",
      tipoIndex: SENSOR_OFFLINE,
      resolvido: true,
    },

    // Abril
    {
      bueiroIndex: 3,
      data_hora: "2026-04-04 09:45:00",
      nivel: "ALTO",
      descricao: "Obstrução por galhos e folhas",
      tipoIndex: OBSTRUCAO,
      resolvido: true,
    },
    {
      bueiroIndex: 6,
      data_hora: "2026-04-12 15:30:00",
      nivel: "MEDIO",
      descricao: "Alagamento pontual na via",
      tipoIndex: ALAGAMENTO,
      resolvido: true,
    },
    {
      bueiroIndex: 9,
      data_hora: "2026-04-19 07:20:00",
      nivel: "BAIXO",
      descricao: "Pequena redução de vazão",
      tipoIndex: VAZAO_BAIXA,
      resolvido: true,
    },
    {
      bueiroIndex: 1,
      data_hora: "2026-04-26 18:10:00",
      nivel: "ALTO",
      descricao: "Sensor de vazão instável",
      tipoIndex: SENSOR_OFFLINE,
      resolvido: true,
    },

    // Maio
    {
      bueiroIndex: 5,
      data_hora: "2026-05-05 10:50:00",
      nivel: "BAIXO",
      descricao: "Sedimentação leve identificada",
      tipoIndex: OBSTRUCAO,
      resolvido: true,
    },
    {
      bueiroIndex: 7,
      data_hora: "2026-05-13 16:05:00",
      nivel: "CRITICO",
      descricao: "Risco iminente de transbordamento",
      tipoIndex: ALAGAMENTO,
      resolvido: true,
    },
    {
      bueiroIndex: 10,
      data_hora: "2026-05-20 11:35:00",
      nivel: "MEDIO",
      descricao: "Vazão abaixo da média semanal",
      tipoIndex: VAZAO_BAIXA,
      resolvido: true,
    },
    {
      bueiroIndex: 2,
      data_hora: "2026-05-28 09:00:00",
      nivel: "ALTO",
      descricao: "Sensor de chuva sem resposta",
      tipoIndex: SENSOR_OFFLINE,
      resolvido: true,
    },

    // Junho (anteriores aos alertas ativos)
    {
      bueiroIndex: 4,
      data_hora: "2026-06-03 07:15:00",
      nivel: "BAIXO",
      descricao: "Acúmulo leve de detritos",
      tipoIndex: OBSTRUCAO,
      resolvido: true,
    },
    {
      bueiroIndex: 8,
      data_hora: "2026-06-08 13:40:00",
      nivel: "MEDIO",
      descricao: "Nível de água acima do normal",
      tipoIndex: ALAGAMENTO,
      resolvido: true,
    },
    {
      bueiroIndex: 1,
      data_hora: "2026-06-12 08:05:00",
      nivel: "BAIXO",
      descricao: "Vazão estabilizada após chuva",
      tipoIndex: VAZAO_BAIXA,
      resolvido: true,
    },
    {
      bueiroIndex: 6,
      data_hora: "2026-06-15 19:20:00",
      nivel: "ALTO",
      descricao: "Sensor de nível intermitente",
      tipoIndex: SENSOR_OFFLINE,
      resolvido: true,
    },
  ];

  for (const item of [...ativos, ...historico]) {
    const bueiro = bueiros[item.bueiroIndex];
    const tipoAlerta = tiposAlerta[item.tipoIndex];
    if (!bueiro) throw new Error(`Missing bueiro at index ${item.bueiroIndex}`);
    if (!tipoAlerta) throw new Error(`Missing tipo_alerta at index ${item.tipoIndex}`);
    await prisma.alertas.create({
      data: {
        bueiro_id: bueiro.id,
        data_hora: new Date(item.data_hora.replace(" ", "T")),
        nivel: item.nivel,
        descricao: item.descricao,
        resolvido: item.resolvido,
        tipo_alerta_id: tipoAlerta.id,
      },
    });
  }
}

async function main() {
  await clear();

  const tiposSensor = await seedTiposSensor();
  const enderecos = await seedEnderecos();
  const bueiros = await seedBueiros(enderecos);
  const sensores = await seedSensores(bueiros, tiposSensor);
  const equipes = await seedEquipes();
  await seedTelefones(equipes);
  await seedLeituras(sensores);
  await seedManutencao(bueiros, equipes);
  const tiposAlerta = await seedTiposAlerta();
  await seedAlertas(bueiros, tiposAlerta);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
