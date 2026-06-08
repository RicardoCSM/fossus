-- TIPOS DE SENSOR

INSERT INTO tipos_sensor (nome, unidade) VALUES
('Chuva', 'mm'),
('Vazao', 'L/s'),
('Sedimento', 'cm'),
('Nivel da Agua', 'cm');

-- ENDERECOS

INSERT INTO enderecos (
    rua,
    numero,
    cep,
    latitude,
    longitude
) VALUES
('Rua das Flores', 120, '35300000', -19.78900000, -42.13900000),
('Avenida Central', 455, '35300001', -19.79000000, -42.14000000),
('Rua Sao Joao', 89, '35300002', -19.79100000, -42.14100000);

-- BUEIROS

INSERT INTO bueiros (
    endereco_id,
    diametro,
    profundidade,
    capacidade_fluxo,
    data_instalacao
) VALUES
(1, 80.00, 100.00, 250.00, '2025-01-10'),
(2, 100.00, 120.00, 300.00, '2025-02-15'),
(3, 90.00, 110.00, 280.00, '2025-03-20');

-- SENSORES

INSERT INTO sensores (
    bueiro_id,
    tipo_sensor_id,
    fabricante,
    numero_serie,
    data_instalacao,
    ultima_calibracao,
    status
) VALUES
(1, 1, 'Intelbras', 'CH001', '2025-01-10', '2026-01-01', 'ATIVO'),
(1, 3, 'Intelbras', 'SD001', '2025-01-10', '2026-01-01', 'ATIVO'),

(2, 2, 'Bosch', 'VZ001', '2025-02-15', '2026-01-01', 'ATIVO'),
(2, 4, 'Bosch', 'NA001', '2025-02-15', '2026-01-01', 'ATIVO'),

(3, 1, 'Siemens', 'CH002', '2025-03-20', '2026-01-01', 'ATIVO'),
(3, 3, 'Siemens', 'SD002', '2025-03-20', '2026-01-01', 'ATIVO');

-- EQUIPES

INSERT INTO equipes (nome) VALUES
('Equipe Norte'),
('Equipe Sul'),
('Equipe Emergencial');

-- TELEFONES

INSERT INTO telefones (
    equipe_id,
    telefone
) VALUES
(1, '(33)99999-1111'),
(2, '(33)99999-2222'),
(3, '(33)99999-3333');

-- LEITURAS

INSERT INTO leituras (
    sensor_id,
    valor,
    data_hora
) VALUES

-- Sensor de chuva (mm)
(1, 15.20, '2026-06-01 08:00:00'),
(1, 28.50, '2026-06-01 09:00:00'),
(1, 42.70, '2026-06-01 10:00:00'),

-- Sensor de sedimento (cm)
(2, 20.00, '2026-06-01 08:00:00'),
(2, 32.00, '2026-06-01 09:00:00'),
(2, 48.00, '2026-06-01 10:00:00'),

-- Sensor de vazao (L/s)
(3, 220.00, '2026-06-01 08:00:00'),
(3, 180.00, '2026-06-01 09:00:00'),
(3, 110.00, '2026-06-01 10:00:00'),

-- Sensor de nivel da agua (cm)
(4, 35.00, '2026-06-01 08:00:00'),
(4, 55.00, '2026-06-01 09:00:00'),
(4, 80.00, '2026-06-01 10:00:00');

-- MANUTENCOES

INSERT INTO manutencao (
    bueiro_id,
    equipe_id,
    data_abertura,
    data_execucao,
    status,
    descricao
) VALUES
(
    1,
    1,
    '2026-05-15 08:00:00',
    '2026-05-15 14:00:00',
    'CONCLUIDA',
    'Limpeza preventiva'
),
(
    2,
    3,
    '2026-05-28 09:00:00',
    NULL,
    'EM_ANDAMENTO',
    'Remocao de sedimentos'
);

-- TIPOS DE ALERTA

INSERT INTO tipos_alerta (
    nome,
    descricao
) VALUES
(
    'OBSTRUCAO',
    'Obstrucao critica do bueiro'
),
(
    'ALAGAMENTO',
    'Risco ou ocorrencia de alagamento'
),
(
    'VAZAO_BAIXA',
    'Reducao da capacidade de escoamento'
),
(
    'SENSOR_OFFLINE',
    'Sensor sem comunicacao'
);

-- ALERTAS

INSERT INTO alertas (
    bueiro_id,
    tipo_alerta_id,
    data_hora,
    nivel,
    descricao,
    resolvido
) VALUES
(
    1,
    1,
    '2026-06-01 10:00:00',
    'ALTO',
    'Obstrucao acima de 70%',
    0
),
(
    2,
    2,
    '2026-06-01 11:00:00',
    'CRITICO',
    'Risco elevado de alagamento',
    0
);