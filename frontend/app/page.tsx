"use client";

import { useState } from "react";

export default function Home() {
  const [ciudad, setCiudad] = useState("");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [huespedes, setHuespedes] = useState(1);

  function buscarPropiedades(e: React.FormEvent) {
    e.preventDefault();

    alert(
      `Buscando propiedades en ${ciudad || "cualquier ciudad"} desde ${
        desde || "cualquier fecha"
      } hasta ${hasta || "cualquier fecha"} para ${huespedes} huésped${
        huespedes !== 1 ? "es" : ""
      }.`
    );
  }

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <h1 className="text-3xl font-bold text-rose-500">Airbnb</h1>

          <nav className="flex items-center gap-6">
            <a href="#" className="text-sm font-medium hover:text-rose-500">
              Alojamientos
            </a>

            <a href="#" className="text-sm font-medium hover:text-rose-500">
              Mis reservas
            </a>

            <a href="#" className="text-sm font-medium hover:text-rose-500">
              Favoritos
            </a>

            <button className="rounded-full border px-5 py-2 text-sm font-medium hover:bg-gray-100">
              Iniciar sesión
            </button>
          </nav>
        </div>
      </header>

      <section className="bg-gray-100 px-6 py-16">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-5xl font-bold tracking-tight">
            Encontrá tu próximo alojamiento
          </h2>

          <p className="mt-4 text-lg text-gray-600">
            Buscá propiedades, reservá tu estadía y disfrutá del viaje.
          </p>

          <form
            onSubmit={buscarPropiedades}
            className="mt-10 rounded-3xl bg-white p-4 shadow-lg"
          >
            <div className="grid gap-4 md:grid-cols-4">
              <div className="text-left">
                <label className="mb-2 block text-sm font-semibold">
                  Ciudad
                </label>

                <input
                  type="text"
                  placeholder="¿A dónde vas?"
                  value={ciudad}
                  onChange={(e) => setCiudad(e.target.value)}
                  className="w-full rounded-xl border px-4 py-3 outline-none focus:border-rose-500"
                />
              </div>

              <div className="text-left">
                <label className="mb-2 block text-sm font-semibold">
                  Desde
                </label>

                <input
                  type="date"
                  value={desde}
                  onChange={(e) => setDesde(e.target.value)}
                  className="w-full rounded-xl border px-4 py-3 outline-none focus:border-rose-500"
                />
              </div>

              <div className="text-left">
                <label className="mb-2 block text-sm font-semibold">
                  Hasta
                </label>

                <input
                  type="date"
                  value={hasta}
                  onChange={(e) => setHasta(e.target.value)}
                  className="w-full rounded-xl border px-4 py-3 outline-none focus:border-rose-500"
                />
              </div>

              <div className="text-left">
                <label className="mb-2 block text-sm font-semibold">
                  Huéspedes
                </label>

                <input
                  type="number"
                  min="1"
                  value={huespedes}
                  onChange={(e) => setHuespedes(Number(e.target.value))}
                  className="w-full rounded-xl border px-4 py-3 outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-5 w-full rounded-xl bg-rose-500 px-6 py-4 font-semibold text-white transition hover:bg-rose-600"
            >
              Buscar propiedades
            </button>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <h2 className="text-3xl font-bold">Explorá alojamientos</h2>

        <p className="mt-2 text-gray-600">
          Próximamente vas a poder ver propiedades disponibles.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border p-6 shadow-sm">
            <div className="flex h-40 items-center justify-center rounded-xl bg-gray-200 text-gray-500">
              Imagen de propiedad
            </div>

            <h3 className="mt-4 text-xl font-semibold">Buenos Aires</h3>

            <p className="mt-2 text-gray-600">
              Propiedades disponibles próximamente.
            </p>
          </div>

          <div className="rounded-2xl border p-6 shadow-sm">
            <div className="flex h-40 items-center justify-center rounded-xl bg-gray-200 text-gray-500">
              Imagen de propiedad
            </div>

            <h3 className="mt-4 text-xl font-semibold">Córdoba</h3>

            <p className="mt-2 text-gray-600">
              Propiedades disponibles próximamente.
            </p>
          </div>

          <div className="rounded-2xl border p-6 shadow-sm">
            <div className="flex h-40 items-center justify-center rounded-xl bg-gray-200 text-gray-500">
              Imagen de propiedad
            </div>

            <h3 className="mt-4 text-xl font-semibold">Bariloche</h3>

            <p className="mt-2 text-gray-600">
              Propiedades disponibles próximamente.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t bg-gray-50 px-6 py-8">
        <div className="mx-auto max-w-7xl text-center text-sm text-gray-500">
          Airbnb - Proyecto de Taller de Programación
        </div>
      </footer>
    </main>
  );
}