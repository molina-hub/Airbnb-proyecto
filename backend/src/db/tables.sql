DROP TABLE IF EXISTS favoritos CASCADE;
DROP TABLE IF EXISTS propiedad_amenidades CASCADE;
DROP TABLE IF EXISTS resenas CASCADE;
DROP TABLE IF EXISTS reservas CASCADE;
DROP TABLE IF EXISTS propiedades CASCADE;
DROP TABLE IF EXISTS amenidades CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    es_anfitrion BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE propiedades (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    direccion VARCHAR(200) NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    precio_noche NUMERIC(10, 2) NOT NULL CHECK (precio_noche > 0),
    capacidad INTEGER NOT NULL CHECK (capacidad > 0),
    anfitrion_id INTEGER NOT NULL REFERENCES usuarios(id)
);

CREATE TABLE reservas (
    id SERIAL PRIMARY KEY,
    propiedad_id INTEGER NOT NULL REFERENCES propiedades(id),
    huesped_id INTEGER NOT NULL REFERENCES usuarios(id),
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente'
        CHECK (estado IN ('pendiente', 'confirmada', 'rechazada', 'cancelada')),
    total NUMERIC(10, 2) NOT NULL CHECK (total >= 0),
    CONSTRAINT fechas_validas CHECK (fecha_inicio < fecha_fin)
);

CREATE TABLE resenas (
    id SERIAL PRIMARY KEY,
    reserva_id INTEGER NOT NULL UNIQUE REFERENCES reservas(id),
    autor_id INTEGER NOT NULL REFERENCES usuarios(id),
    puntaje INTEGER NOT NULL CHECK (puntaje BETWEEN 1 AND 5),
    comentario TEXT,
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE amenidades (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE propiedad_amenidades (
    propiedad_id INTEGER NOT NULL REFERENCES propiedades(id) ON DELETE CASCADE,
    amenidad_id INTEGER NOT NULL REFERENCES amenidades(id) ON DELETE CASCADE,
    PRIMARY KEY (propiedad_id, amenidad_id)
);

CREATE TABLE favoritos (
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    propiedad_id INTEGER NOT NULL REFERENCES propiedades(id) ON DELETE CASCADE,
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (usuario_id, propiedad_id)
);

INSERT INTO usuarios (email, nombre, es_anfitrion) VALUES
('juan@gmail.com', 'Juan Perez', TRUE),
('maria@gmail.com', 'Maria Lopez', TRUE),
('pedro@gmail.com', 'Pedro Gonzalez', FALSE),
('ana@gmail.com', 'Ana Martinez', FALSE),
('lucas@gmail.com', 'Lucas Fernandez', TRUE);

INSERT INTO propiedades
(titulo, direccion, ciudad, precio_noche, capacidad, anfitrion_id) VALUES
('Casa con pileta', 'Av. Siempre Viva 123', 'Buenos Aires', 80000, 6, 1),
('Departamento centrico', 'Calle Florida 456', 'Buenos Aires', 55000, 3, 2),
('Casa frente al mar', 'Av. Costanera 789', 'Mar del Plata', 95000, 5, 1),
('Cabaña de montaña', 'Ruta 40 km 20', 'Bariloche', 110000, 4, 5),
('Departamento moderno', 'Calle Mitre 321', 'Cordoba', 60000, 4, 5);

INSERT INTO amenidades (nombre) VALUES
('wifi'),
('pileta'),
('estacionamiento'),
('aire_acondicionado'),
('cocina');

INSERT INTO reservas
(propiedad_id, huesped_id, fecha_inicio, fecha_fin, estado, total) VALUES
(1, 3, '2026-09-10', '2026-09-15', 'confirmada', 400000),
(2, 4, '2026-09-20', '2026-09-23', 'pendiente', 165000),
(3, 3, '2026-10-01', '2026-10-05', 'confirmada', 380000),
(4, 4, '2026-11-10', '2026-11-14', 'rechazada', 440000),
(5, 3, '2026-12-01', '2026-12-04', 'cancelada', 180000);

INSERT INTO resenas
(reserva_id, autor_id, puntaje, comentario, fecha) VALUES
(1, 3, 5, 'Excelente propiedad.', '2026-09-16'),
(3, 3, 4, 'Muy buena estadia.', '2026-10-06');

INSERT INTO propiedad_amenidades (propiedad_id, amenidad_id) VALUES
(1, 1),
(1, 2),
(1, 3),
(2, 1),
(2, 4),
(3, 1),
(3, 2),
(3, 5),
(4, 1),
(4, 3),
(5, 1),
(5, 4),
(5, 5);

INSERT INTO favoritos (usuario_id, propiedad_id) VALUES
(3, 1),
(3, 2),
(4, 3),
(4, 5),
(3, 4);