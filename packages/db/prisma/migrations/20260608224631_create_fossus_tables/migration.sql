CREATE TABLE enderecos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rua VARCHAR(100) NOT NULL,
    numero INT,
    cep VARCHAR(10),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8)
);

CREATE TABLE bueiros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    endereco_id INT NOT NULL,
    diametro DECIMAL(6,2),
    profundidade DECIMAL(6,2),
    capacidade_fluxo DECIMAL(10,2),
    data_instalacao DATE,

    CONSTRAINT fk_bueiro_endereco
        FOREIGN KEY (endereco_id)
        REFERENCES enderecos(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE tipos_sensor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    unidade VARCHAR(20) NOT NULL
);

CREATE TABLE sensores (
    id INT AUTO_INCREMENT PRIMARY KEY,

    bueiro_id INT NOT NULL,
    tipo_sensor_id INT NOT NULL,

    fabricante VARCHAR(100),
    numero_serie VARCHAR(100) UNIQUE,

    data_instalacao DATE,
    ultima_calibracao DATE,

    status VARCHAR(30),

    CONSTRAINT fk_sensor_bueiro
        FOREIGN KEY (bueiro_id)
        REFERENCES bueiros(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_sensor_tipo
        FOREIGN KEY (tipo_sensor_id)
        REFERENCES tipos_sensor(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

CREATE TABLE leituras (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    sensor_id INT NOT NULL,

    valor DECIMAL(10,2) NOT NULL,
    data_hora DATETIME NOT NULL,

    CONSTRAINT fk_leitura_sensor
        FOREIGN KEY (sensor_id)
        REFERENCES sensores(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE equipes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);

CREATE TABLE telefones (
    id INT AUTO_INCREMENT PRIMARY KEY,

    equipe_id INT NOT NULL,
    telefone VARCHAR(20),

    CONSTRAINT fk_telefone_equipe
        FOREIGN KEY (equipe_id)
        REFERENCES equipes(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE manutencao (
    id INT AUTO_INCREMENT PRIMARY KEY,

    bueiro_id INT NOT NULL,
    equipe_id INT NOT NULL,

    data_abertura DATETIME,
    data_execucao DATETIME,

    status VARCHAR(30),
    descricao TEXT,

    CONSTRAINT fk_manutencao_bueiro
        FOREIGN KEY (bueiro_id)
        REFERENCES bueiros(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_manutencao_equipe
        FOREIGN KEY (equipe_id)
        REFERENCES equipes(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

CREATE TABLE tipos_alerta (
    id INT AUTO_INCREMENT PRIMARY KEY,

    nome VARCHAR(50) NOT NULL,
    descricao TEXT
);

CREATE TABLE alertas (
    id INT AUTO_INCREMENT PRIMARY KEY,

    bueiro_id INT NOT NULL,
    tipo_alerta_id INT NULL,

    data_hora DATETIME NOT NULL,
    nivel VARCHAR(20),

    descricao TEXT,

    resolvido BOOLEAN DEFAULT FALSE,

    CONSTRAINT fk_alerta_bueiro
        FOREIGN KEY (bueiro_id)
        REFERENCES bueiros(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_alerta_tipo
        FOREIGN KEY (tipo_alerta_id)
        REFERENCES tipos_alerta(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

CREATE INDEX idx_leituras_sensor
    ON leituras(sensor_id);

CREATE INDEX idx_leituras_data
    ON leituras(data_hora);

CREATE INDEX idx_sensor_data
    ON leituras(sensor_id, data_hora);

CREATE INDEX idx_alertas_bueiro
    ON alertas(bueiro_id);

CREATE INDEX idx_alertas_data
    ON alertas(data_hora);

CREATE INDEX idx_manutencao_bueiro
    ON manutencao(bueiro_id);

CREATE INDEX idx_sensores_bueiro
    ON sensores(bueiro_id);