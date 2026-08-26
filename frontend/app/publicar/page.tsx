"use client";

import { useState } from "react";

export default function PublicarPropiedad() {
  const [titulo, setTitulo] = useState("");
  const [direccion, setDireccion] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [precioNoche, setPrecioNoche] = useState("");
  const [capacidad, setCapacidad] = useState("");
  const [mensaje, setMensaje] = useState("");

  function publicar(e: React.FormEvent) {
    e.preventDefault();

    if (!titulo || !direccion || !ciudad || !precioNoche || !capacidad) {
      setMensaje("Completá todos los campos obligatorios.");
      return;
    }

    if (Number(precioNoche) <= 0) {
      setMensaje("El precio por noche debe ser mayor a 0.");
      return;
    }

    if (Number(capacidad) <= 0) {
      setMensaje("La capacidad debe ser mayor a 0.");
      return;
    }

    setMensaje(
      `Propiedad preparada para publicar: ${titulo} - ${ciudad} - $${precioNoche} por noche - Capacidad: ${capacidad} huéspedes.`
    );
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

      <section className="flex justify-center px-6 py-12">
        <div className="w-full max-w-2xl rounded-3xl bg-white p-8 shadow-lg">
          <h1 className="text-3xl font-bold text-gray-900">
            Publicar una propiedad
          </h1>

          <p className="mt-2 text-gray-600">
            Completá los datos de tu alojamiento para recibir reservas.
          </p>

          <form
            onSubmit={publicar}
            className="mt-8 space-y-5"
          >
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">
                Título
              </label>

              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ej: Casa con pileta y jardín"
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
                placeholder="Ej: Av. Corrientes 1234"
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

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Precio por noche
                </label>

                <input
                  type="number"
                  min="1"
                  value={precioNoche}
                  onChange={(e) => setPrecioNoche(e.target.value)}
                  placeholder="Ej: 50000"
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
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-rose-500 px-6 py-4 font-semibold text-white hover:bg-rose-600"
            >
              Publicar propiedad
            </button>
          </form>

          {mensaje && (
            <div className="mt-6 rounded-xl bg-gray-100 p-4 text-sm text-gray-900">
              {mensaje}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}