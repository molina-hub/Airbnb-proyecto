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
    es_anfitrion BOOLEAN NOT NULL DEFAULT FALSE,
    password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE propiedades (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    direccion VARCHAR(200) NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    precio_noche NUMERIC(10, 2) NOT NULL CHECK (precio_noche > 0),
    capacidad INTEGER NOT NULL CHECK (capacidad > 0),
    descripcion VARCHAR(1000),
    imagen_url VARCHAR(500),
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

INSERT INTO usuarios (email, nombre, es_anfitrion, password_hash) VALUES
('juan@gmail.com', 'Juan Perez', TRUE, '$2b$12$SXZ9Mr5mWYDAOaDE7ia56O9rOKyIkfZ7xeDxBO/4DQWhJ5oUDZfwW'),
('maria@gmail.com', 'Maria Lopez', TRUE, '$2b$12$SXZ9Mr5mWYDAOaDE7ia56O9rOKyIkfZ7xeDxBO/4DQWhJ5oUDZfwW'),
('pedro@gmail.com', 'Pedro Gonzalez', FALSE, '$2b$12$SXZ9Mr5mWYDAOaDE7ia56O9rOKyIkfZ7xeDxBO/4DQWhJ5oUDZfwW'),
('ana@gmail.com', 'Ana Martinez', FALSE, '$2b$12$SXZ9Mr5mWYDAOaDE7ia56O9rOKyIkfZ7xeDxBO/4DQWhJ5oUDZfwW'),
('lucas@gmail.com', 'Lucas Fernandez', TRUE, '$2b$12$SXZ9Mr5mWYDAOaDE7ia56O9rOKyIkfZ7xeDxBO/4DQWhJ5oUDZfwW');

INSERT INTO propiedades
(titulo, direccion, ciudad, descripcion, imagen_url, precio_noche, capacidad, anfitrion_id) VALUES
('Casa con pileta', 'Av. Siempre Viva 123', 'Buenos Aires', 'Casa luminosa con pileta privada y jardín.', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85', 80000, 6, 1),
('Departamento céntrico', 'Calle Florida 456', 'Buenos Aires', 'Departamento moderno a pasos de los principales puntos de interés.', 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85', 55000, 3, 2),
('Casa frente al mar', 'Av. Costanera 789', 'Mar del Plata', 'Amplia casa con vista abierta al mar y espacios para descansar.', 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=85', 95000, 5, 1),
('Cabaña de montaña', 'Ruta 40 km 20', 'Bariloche', 'Cabaña cálida en plena naturaleza, ideal para una escapada.', 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=85', 110000, 4, 5),
('Departamento moderno', 'Calle Mitre 321', 'Córdoba', 'Espacio contemporáneo, equipado y cómodo para trabajar o descansar.', 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85', 60000, 4, 5);

INSERT INTO amenidades (nombre) VALUES
('wifi'),
('pileta'),
('estacionamiento'),
('aire_acondicionado'),
('cocina');

INSERT INTO reservas
(propiedad_id, huesped_id, fecha_inicio, fecha_fin, estado, total) VALUES
(1, 3, '2026-07-10', '2026-07-15', 'confirmada', 400000),
(1, 4, '2026-07-20', '2026-07-23', 'confirmada', 240000),
(1, 3, '2026-08-01', '2026-08-05', 'confirmada', 320000),
(2, 4, '2026-08-10', '2026-08-14', 'confirmada', 220000),
(3, 3, '2026-08-20', '2026-08-24', 'confirmada', 380000);

INSERT INTO resenas
(reserva_id, autor_id, puntaje, comentario, fecha) VALUES
(1, 3, 5, 'Excelente propiedad.', '2026-07-16'),
(2, 4, 4, 'Muy cómoda y bien ubicada.', '2026-07-24'),
(3, 3, 5, 'Volveríamos sin dudarlo.', '2026-08-06'),
(4, 4, 4, 'Departamento impecable.', '2026-08-15'),
(5, 3, 5, 'Hermosa vista al mar.', '2026-08-25');

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
