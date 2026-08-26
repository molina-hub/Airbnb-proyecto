"use client";

import { useState } from "react";

type Propiedad = {
  id: number;
  titulo: string;
  ciudad: string;
  direccion: string;
  capacidad: number;
  precio: number;
  amenidades: string;
};

const propiedadesIniciales: Propiedad[] = [
  {
    id: 1,
    titulo: "Casa con pileta",
    ciudad: "Buenos Aires",
    direccion: "Palermo",
    capacidad: 4,
    precio: 50000,
    amenidades: "WiFi, pileta, cocina",
  },
  {
    id: 2,
    titulo: "Departamento moderno",
    ciudad: "Córdoba",
    direccion: "Nueva Córdoba",
    capacidad: 2,
    precio: 40000,
    amenidades: "WiFi, aire acondicionado",
  },
];

export default function MisPropiedades() {
  const [propiedades, setPropiedades] = useState<Propiedad[]>(
    propiedadesIniciales
  );

  const [editando, setEditando] = useState<number | null>(null);
  const [mensaje, setMensaje] = useState("");

  const [titulo, setTitulo] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [direccion, setDireccion] = useState("");
  const [capacidad, setCapacidad] = useState("");
  const [precio, setPrecio] = useState("");
  const [amenidades, setAmenidades] = useState("");

  function limpiarFormulario() {
    setTitulo("");
    setCiudad("");
    setDireccion("");
    setCapacidad("");
    setPrecio("");
    setAmenidades("");
    setEditando(null);
  }

  function editarPropiedad(propiedad: Propiedad) {
    setEditando(propiedad.id);
    setTitulo(propiedad.titulo);
    setCiudad(propiedad.ciudad);
    setDireccion(propiedad.direccion);
    setCapacidad(String(propiedad.capacidad));
    setPrecio(String(propiedad.precio));
    setAmenidades(propiedad.amenidades);

    setMensaje("");
  }

  function guardarPropiedad(e: React.FormEvent) {
    e.preventDefault();

    if (
      !titulo ||
      !ciudad ||
      !direccion ||
      !capacidad ||
      !precio
    ) {
      setMensaje("Completá todos los campos obligatorios.");
      return;
    }

    if (Number(capacidad) <= 0) {
      setMensaje("La capacidad debe ser mayor a 0.");
      return;
    }

    if (Number(precio) <= 0) {
      setMensaje("El precio debe ser mayor a 0.");
      return;
    }

    if (editando !== null) {
      setPropiedades(
        propiedades.map((propiedad) =>
          propiedad.id === editando
            ? {
                ...propiedad,
                titulo,
                ciudad,
                direccion,
                capacidad: Number(capacidad),
                precio: Number(precio),
                amenidades,
              }
            : propiedad
        )
      );

      setMensaje("La propiedad fue actualizada correctamente.");
    } else {
      const nuevaPropiedad: Propiedad = {
        id: Date.now(),
        titulo,
        ciudad,
        direccion,
        capacidad: Number(capacidad),
        precio: Number(precio),
        amenidades,
      };

      setPropiedades([...propiedades, nuevaPropiedad]);

      setMensaje("La propiedad fue creada correctamente.");
    }

    limpiarFormulario();
  }

  function eliminarPropiedad(id: number) {
    const confirmar = window.confirm(
      "¿Seguro que querés eliminar esta propiedad?"
    );

    if (!confirmar) {
      return;
    }

    setPropiedades(
      propiedades.filter((propiedad) => propiedad.id !== id)
    );

    setMensaje("La propiedad fue eliminada correctamente.");
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <a
            href="/"
            className="text-3xl font-bold text-rose-500"
          >
            Airbnb
          </a>

          <a
            href="/"
            className="text-sm font-medium text-gray-900 hover:text-rose-500"
          >
            Volver al inicio
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Mis propiedades
            </h1>

            <p className="mt-2 text-gray-600">
              Administrá las propiedades que publicaste.
            </p>
          </div>

          <button
            onClick={limpiarFormulario}
            className="rounded-xl bg-rose-500 px-6 py-3 font-semibold text-white hover:bg-rose-600"
          >
            Nueva propiedad
          </button>
        </div>

        {mensaje && (
          <div className="mt-6 rounded-xl bg-white p-4 text-gray-900 shadow">
            {mensaje}
          </div>
        )}

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {propiedades.map((propiedad) => (
            <div
              key={propiedad.id}
              className="rounded-3xl bg-white p-6 shadow"
            >
              <h2 className="text-2xl font-bold text-gray-900">
                {propiedad.titulo}
              </h2>

              <p className="mt-2 text-gray-600">
                {propiedad.ciudad}
              </p>

              <p className="mt-1 text-gray-600">
                {propiedad.direccion}
              </p>

              <div className="mt-5 space-y-2 text-gray-900">
                <p>
                  <strong>Capacidad:</strong>{" "}
                  {propiedad.capacidad} huéspedes
                </p>

                <p>
                  <strong>Precio:</strong> $
                  {propiedad.precio} por noche
                </p>

                <p>
                  <strong>Amenidades:</strong>{" "}
                  {propiedad.amenidades || "No especificadas"}
                </p>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button
                  onClick={() => editarPropiedad(propiedad)}
                  className="rounded-xl border border-gray-300 px-4 py-3 font-semibold text-gray-900 hover:bg-gray-100"
                >
                  Editar
                </button>

                <button
                  onClick={() => eliminarPropiedad(propiedad.id)}
                  className="rounded-xl bg-red-600 px-4 py-3 font-semibold text-white hover:bg-red-700"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-3xl bg-white p-8 shadow">
          <h2 className="text-2xl font-bold text-gray-900">
            {editando !== null
              ? "Editar propiedad"
              : "Agregar propiedad"}
          </h2>

          <form
            onSubmit={guardarPropiedad}
            className="mt-6 grid gap-5 md:grid-cols-2"
          >
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">
                Título
              </label>

              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ej: Casa con pileta"
                className="w-full rounded-xl border px-4 py-3 text-gray-900 placeholder:text-gray-500 outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">
                Ciudad
              </label>

              <input
                type="text"
                value={ciudad}
                onChange={(e) => setCiudad(e.target.value)}
                placeholder="Ej: Buenos Aires"
                className="w-full rounded-xl border px-4 py-3 text-gray-900 placeholder:text-gray-500 outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">
                Dirección
              </label>

              <input
                type="text"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                placeholder="Ej: Palermo"
                className="w-full rounded-xl border px-4 py-3 text-gray-900 placeholder:text-gray-500 outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">
                Capacidad
              </label>

              <input
                type="number"
                min="1"
                value={capacidad}
                onChange={(e) => setCapacidad(e.target.value)}
                placeholder="Ej: 4"
                className="w-full rounded-xl border px-4 py-3 text-gray-900 placeholder:text-gray-500 outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">
                Precio por noche
              </label>

              <input
                type="number"
                min="1"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                placeholder="Ej: 50000"
                className="w-full rounded-xl border px-4 py-3 text-gray-900 placeholder:text-gray-500 outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">
                Amenidades
              </label>

              <input
                type="text"
                value={amenidades}
                onChange={(e) => setAmenidades(e.target.value)}
                placeholder="Ej: WiFi, pileta, cocina"
                className="w-full rounded-xl border px-4 py-3 text-gray-900 placeholder:text-gray-500 outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex gap-3 md:col-span-2">
              <button
                type="submit"
                className="rounded-xl bg-rose-500 px-6 py-3 font-semibold text-white hover:bg-rose-600"
              >
                {editando !== null
                  ? "Guardar cambios"
                  : "Crear propiedad"}
              </button>

              {editando !== null && (
                <button
                  type="button"
                  onClick={limpiarFormulario}
                  className="rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-900 hover:bg-gray-100"
                >
                  Cancelar edición
                </button>
              )}
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}