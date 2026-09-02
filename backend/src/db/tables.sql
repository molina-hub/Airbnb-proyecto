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

