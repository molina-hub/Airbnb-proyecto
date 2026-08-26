"use client";

import { useState } from "react";

export default function BuscarPropiedades() {
  const [ciudad, setCiudad] = useState("");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [huespedes, setHuespedes] = useState("");
  const [precioMax, setPrecioMax] = useState("");
  const [mensaje, setMensaje] = useState("");

  function buscar(e: React.FormEvent) {
    e.preventDefault();

    if (!ciudad || !desde || !hasta || !huespedes) {
      setMensaje("Completá ciudad, fechas y cantidad de huéspedes.");
      return;
    }

    if (desde >= hasta) {
      setMensaje("La fecha de entrada debe ser anterior a la fecha de salida.");
      return;
    }

    if (Number(huespedes) <= 0) {
      setMensaje("La cantidad de huéspedes debe ser mayor a 0.");
      return;
    }

    if (precioMax && Number(precioMax) <= 0) {
      setMensaje("El precio máximo debe ser mayor a 0.");
      return;
    }

    setMensaje(
      `Búsqueda realizada en ${ciudad}, desde ${desde} hasta ${hasta}, para ${huespedes} huésped${
        Number(huespedes) !== 1 ? "es" : ""
      }${precioMax ? `, precio máximo $${precioMax}` : ""}.`
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

      <section className="px-6 py-12">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-4xl font-bold text-gray-900">
            Buscar propiedades
          </h1>

          <p className="mt-2 text-gray-600">
            Encontrá alojamientos disponibles según tus necesidades.
          </p>

          <form
            onSubmit={buscar}
            className="mt-8 rounded-3xl bg-white p-8 shadow-lg"
          >
            <div className="grid gap-5 md:grid-cols-2">
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
                  Huéspedes
                </label>

                <input
                  type="number"
                  min="1"
                  value={huespedes}
                  onChange={(e) => setHuespedes(e.target.value)}
                  placeholder="Ej: 2"
                  className="w-full rounded-xl border px-4 py-3 text-gray-900 placeholder:text-gray-500 outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Fecha de entrada
                </label>

                <input
                  type="date"
                  value={desde}
                  onChange={(e) => setDesde(e.target.value)}
                  className="w-full rounded-xl border px-4 py-3 text-gray-900 outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Fecha de salida
                </label>

                <input
                  type="date"
                  value={hasta}
                  onChange={(e) => setHasta(e.target.value)}
                  className="w-full rounded-xl border px-4 py-3 text-gray-900 outline-none focus:border-rose-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Precio máximo por noche (opcional)
                </label>

                <input
                  type="number"
                  min="1"
                  value={precioMax}
                  onChange={(e) => setPrecioMax(e.target.value)}
                  placeholder="Ej: 100000"
                  className="w-full rounded-xl border px-4 py-3 text-gray-900 placeholder:text-gray-500 outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 w-full rounded-xl bg-rose-500 px-6 py-4 font-semibold text-white hover:bg-rose-600"
            >
              Buscar propiedades
            </button>
          </form>

          {mensaje && (
            <div className="mt-6 rounded-xl bg-white p-5 text-gray-900 shadow">
              {mensaje}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}