--
-- PostgreSQL database dump 
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';
SET default_table_access_method = heap;

--
-- 1. TABLA USUARIOS
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    email character varying(150) NOT NULL,
    nombre character varying(100) NOT NULL,
    fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    es_anfitrion boolean DEFAULT false NOT NULL,
    password_hash character varying(255) NOT NULL
);

ALTER TABLE public.usuarios OWNER TO postgres;

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.usuarios_id_seq OWNER TO postgres;
ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;

--
-- 2. TABLA PROPIEDADES
--

CREATE TABLE public.propiedades (
    id integer NOT NULL,
    titulo character varying(150) NOT NULL,
    direccion character varying(200) NOT NULL,
    ciudad character varying(100) NOT NULL,
    precio_noche numeric(10,2) NOT NULL,
    capacidad integer NOT NULL,
    anfitrion_id integer NOT NULL,
    descripcion character varying(1000),
    imagen_url character varying(500),
    CONSTRAINT propiedades_capacidad_check CHECK ((capacidad > 0)),
    CONSTRAINT propiedades_precio_noche_check CHECK ((precio_noche > (0)::numeric))
);

ALTER TABLE public.propiedades OWNER TO postgres;

CREATE SEQUENCE public.propiedades_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.propiedades_id_seq OWNER TO postgres;
ALTER SEQUENCE public.propiedades_id_seq OWNED BY public.propiedades.id;

--
-- 3. TABLA AMENIDADES
--

CREATE TABLE public.amenidades (
    id integer NOT NULL,
    nombre character varying(50) NOT NULL
);

ALTER TABLE public.amenidades OWNER TO postgres;

CREATE SEQUENCE public.amenidades_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.amenidades_id_seq OWNER TO postgres;
ALTER SEQUENCE public.amenidades_id_seq OWNED BY public.amenidades.id;

--
-- 4. TABLA PROPIEDAD_AMENIDADES
--

CREATE TABLE public.propiedad_amenidades (
    propiedad_id integer NOT NULL,
    amenidad_id integer NOT NULL
);

ALTER TABLE public.propiedad_amenidades OWNER TO postgres;

--
-- 5. TABLA RESERVAS
--

CREATE TABLE public.reservas (
    id integer NOT NULL,
    propiedad_id integer NOT NULL,
    huesped_id integer NOT NULL,
    fecha_inicio date NOT NULL,
    fecha_fin date NOT NULL,
    estado character varying(20) DEFAULT 'pendiente'::character varying NOT NULL,
    total numeric(10,2) NOT NULL,
    CONSTRAINT fechas_validas CHECK ((fecha_inicio < fecha_fin)),
    CONSTRAINT reservas_estado_check CHECK (((estado)::text = ANY ((ARRAY['pendiente'::character varying, 'confirmada'::character varying, 'rechazada'::character varying, 'cancelada'::character varying])::text[]))),
    CONSTRAINT reservas_total_check CHECK ((total >= (0)::numeric))
);

ALTER TABLE public.reservas OWNER TO postgres;

CREATE SEQUENCE public.reservas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.reservas_id_seq OWNER TO postgres;
ALTER SEQUENCE public.reservas_id_seq OWNED BY public.reservas.id;

--
-- 6. TABLA RESEÑAS
--

CREATE TABLE public.resenas (
    id integer NOT NULL,
    reserva_id integer NOT NULL,
    autor_id integer NOT NULL,
    puntaje integer NOT NULL,
    comentario text,
    fecha timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT resenas_puntaje_check CHECK (((puntaje >= 1) AND (puntaje <= 5)))
);

ALTER TABLE public.resenas OWNER TO postgres;

CREATE SEQUENCE public.resenas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.resenas_id_seq OWNER TO postgres;
ALTER SEQUENCE public.resenas_id_seq OWNED BY public.resenas.id;

--
-- 7. TABLA FAVORITOS
--

CREATE TABLE public.favoritos (
    usuario_id integer NOT NULL,
    propiedad_id integer NOT NULL,
    fecha timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

ALTER TABLE public.favoritos OWNER TO postgres;

--
-- DEFAULTS DE SECUENCIAS
--

ALTER TABLE ONLY public.amenidades ALTER COLUMN id SET DEFAULT nextval('public.amenidades_id_seq'::regclass);
ALTER TABLE ONLY public.propiedades ALTER COLUMN id SET DEFAULT nextval('public.propiedades_id_seq'::regclass);
ALTER TABLE ONLY public.resenas ALTER COLUMN id SET DEFAULT nextval('public.resenas_id_seq'::regclass);
ALTER TABLE ONLY public.reservas ALTER COLUMN id SET DEFAULT nextval('public.reservas_id_seq'::regclass);
ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);

--
-- DATOS (DATA)
--

COPY public.usuarios (id, email, nombre, fecha_registro, es_anfitrion, password_hash) FROM stdin;
1	juan@gmail.com	Juan Perez	2026-09-01 19:03:40.14818	t	$2b$12$gURX0xYE9uL2Hu0SVJIbP.u6a9O7fNglZxpOjDL.vw.M/lX3vUsb.
2	maria@gmail.com	Maria Lopez	2026-09-01 19:03:40.14818	t	$2b$12$gURX0xYE9uL2Hu0SVJIbP.u6a9O7fNglZxpOjDL.vw.M/lX3vUsb.
3	pedro@gmail.com	Pedro Gonzalez	2026-09-01 19:03:40.14818	f	$2b$12$gURX0xYE9uL2Hu0SVJIbP.u6a9O7fNglZxpOjDL.vw.M/lX3vUsb.
4	ana@gmail.com	Ana Martinez	2026-09-01 19:03:40.14818	f	$2b$12$gURX0xYE9uL2Hu0SVJIbP.u6a9O7fNglZxpOjDL.vw.M/lX3vUsb.
5	lucas@gmail.com	Lucas Fernandez	2026-09-01 19:03:40.14818	t	$2b$12$gURX0xYE9uL2Hu0SVJIbP.u6a9O7fNglZxpOjDL.vw.M/lX3vUsb.
6	moli@gmail.com	moli	2026-09-01 22:29:09.435489	t	$2b$12$gURX0xYE9uL2Hu0SVJIbP.u6a9O7fNglZxpOjDL.vw.M/lX3vUsb.
7	juan.molina@philips.edu.ar	moli	2026-09-01 22:32:14.080809	t	$2b$12$gURX0xYE9uL2Hu0SVJIbP.u6a9O7fNglZxpOjDL.vw.M/lX3vUsb.
8	edf@phili.com	d	2026-09-01 22:34:03.606722	t	$2b$12$gURX0xYE9uL2Hu0SVJIbP.u6a9O7fNglZxpOjDL.vw.M/lX3vUsb.
9	moli@philips.edu.ar	moli	2026-09-01 23:23:07.045743	f	$2b$12$JPaV5GQunXgfnEvB7QY2yu518FNYGRPQEtWyJlS2AgYnTV4pcNPpe
10	juanma@philips.edu.ar	juanma	2026-09-01 23:24:01.52581	t	$2b$12$CcTHcFgaQa.f3Ym6twmbQu1j/BbzVrdjE1UKBoDJHiEnXtnhiPxQK
11	m@philips.edu.ar	moli	2026-09-02 00:11:23.487347	f	$2b$12$fysf3R57L9UdV7IUoGLIceC06GwRRkgsjPohsaA1WjCXxWuDlLRx.
12	molina@philips.edu.ar	molina	2026-09-02 00:12:48.746029	t	$2b$12$FQl.dRoriVfWUkbsr2SfXOy1fWxHdwilBkRVi7o78RvXUSKaequnO
13	jerez@philips.edu.ar	jerez	2026-09-02 10:36:00.095051	t	$2b$12$xy4WZ.peLMvKaQwqlqtYqeI4hEofT8oqDTEW9WuVmuLA2/IywXxcW
14	juanchi@philips.edu.ar	juanchi	2026-09-02 10:47:08.830016	t	$2b$12$g0oTNNkypFowKiO57JdcYeFhRvEACSrPqJu37N2IpIF6Asd4wgRbu
\.

COPY public.propiedades (id, titulo, direccion, ciudad, precio_noche, capacidad, anfitrion_id, descripcion, imagen_url) FROM stdin;
7	casa jerez	1234	cordoba	1000.00	4	12		https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQI-FDF8b8y0J85sDrFJW41_c5vrI8d3OOmqBfyU6cC3A&s=10
8	casa molina	congreso 1234	buenos aires	1500.00	1	10	casa de 2 pisos con balcon	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTh9C6CLaJcfPxzVKb4wWY4GhvLXrtma8O4UlMVLvs3iw&s=10
9	casa con pileta	Hipólito Yrigoyen 570	mar del plata	2100.00	1	13	casa con amplio jardin	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSts6en-do7pxsAFcosW9-ED6dFT4XBh7K0BaAkg4cwow&s=10
10	pen house	1000 Brickell Plaza, Penthouse 5001, Miami, FL 33131	Miami	7000.00	6	14	departamento (pen house), en el ultimo piso del hotel	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS13At5AT5KfW8kGovQnL7sLCa1oeSUJJo90VFSCoqhfg&s=10
11	casa sin foto	mendoza 123	mendoza	1200.00	1	14		
\.

COPY public.amenidades (id, nombre) FROM stdin;
1	wifi
2	pileta
3	estacionamiento
4	aire_acondicionado
5	cocina
\.

COPY public.propiedad_amenidades (propiedad_id, amenidad_id) FROM stdin;
7	1
8	1
9	1
9	2
10	1
\.

COPY public.reservas (id, propiedad_id, huesped_id, fecha_inicio, fecha_fin, estado, total) FROM stdin;
14	7	9	2026-10-02	2026-11-07	rechazada	36000.00
13	7	9	2026-08-30	2026-09-18	cancelada	19000.00
15	7	9	2026-09-02	2026-09-25	confirmada	23000.00
16	7	10	2026-09-26	2026-10-10	confirmada	14000.00
\.

COPY public.resenas (id, reserva_id, autor_id, puntaje, comentario, fecha) FROM stdin;
6	15	9	3	limpio y barato, muy antigüa	2026-09-02 09:15:51.479651
7	16	10	4	\N	2026-09-02 09:20:18.062224
\.

COPY public.favoritos (usuario_id, propiedad_id, fecha) FROM stdin;
\.

--
-- AJUSTE DE VALORES DE SECUENCIAS
--

SELECT pg_catalog.setval('public.amenidades_id_seq', 5, true);
SELECT pg_catalog.setval('public.propiedades_id_seq', 12, true);
SELECT pg_catalog.setval('public.resenas_id_seq', 7, true);
SELECT pg_catalog.setval('public.reservas_id_seq', 16, true);
SELECT pg_catalog.setval('public.usuarios_id_seq', 14, true);

--
-- RESTRICCIONES Y CLAVES PRIMARIAS (CONSTRAINTS & PK)
--

ALTER TABLE ONLY public.amenidades ADD CONSTRAINT amenidades_nombre_key UNIQUE (nombre);
ALTER TABLE ONLY public.amenidades ADD CONSTRAINT amenidades_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.favoritos ADD CONSTRAINT favoritos_pkey PRIMARY KEY (usuario_id, propiedad_id);
ALTER TABLE ONLY public.propiedad_amenidades ADD CONSTRAINT propiedad_amenidades_pkey PRIMARY KEY (propiedad_id, amenidad_id);
ALTER TABLE ONLY public.propiedades ADD CONSTRAINT propiedades_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.resenas ADD CONSTRAINT resenas_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.resenas ADD CONSTRAINT resenas_reserva_id_key UNIQUE (reserva_id);
ALTER TABLE ONLY public.reservas ADD CONSTRAINT reservas_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.usuarios ADD CONSTRAINT usuarios_email_key UNIQUE (email);
ALTER TABLE ONLY public.usuarios ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);

--
-- CLAVES FORÁNEAS (FOREIGN KEYS)
--

ALTER TABLE ONLY public.favoritos ADD CONSTRAINT favoritos_propiedad_id_fkey FOREIGN KEY (propiedad_id) REFERENCES public.propiedades(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.favoritos ADD CONSTRAINT favoritos_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.propiedad_amenidades ADD CONSTRAINT propiedad_amenidades_amenidad_id_fkey FOREIGN KEY (amenidad_id) REFERENCES public.amenidades(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.propiedad_amenidades ADD CONSTRAINT propiedad_amenidades_propiedad_id_fkey FOREIGN KEY (propiedad_id) REFERENCES public.propiedades(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.propiedades ADD CONSTRAINT propiedades_anfitrion_id_fkey FOREIGN KEY (anfitrion_id) REFERENCES public.usuarios(id);
ALTER TABLE ONLY public.resenas ADD CONSTRAINT resenas_autor_id_fkey FOREIGN KEY (autor_id) REFERENCES public.usuarios(id);
ALTER TABLE ONLY public.resenas ADD CONSTRAINT resenas_reserva_id_fkey FOREIGN KEY (reserva_id) REFERENCES public.reservas(id);
ALTER TABLE ONLY public.reservas ADD CONSTRAINT reservas_huesped_id_fkey FOREIGN KEY (huesped_id) REFERENCES public.usuarios(id);
ALTER TABLE ONLY public.reservas ADD CONSTRAINT reservas_propiedad_id_fkey FOREIGN KEY (propiedad_id) REFERENCES public.propiedades(id);