"use client";

import { useState } from "react";

export default function Reservar() {
  const [propiedad, setPropiedad] = useState("");
  const [precioNoche, setPrecioNoche] = useState("");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [huespedes, setHuespedes] = useState("");
  const [mensaje, setMensaje] = useState("");

  function calcularNoches(fechaInicio: string, fechaFin: string) {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    const diferencia = fin.getTime() - inicio.getTime();

    return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
  }

  function reservar(e: React.FormEvent) {
    e.preventDefault();

    if (
      !propiedad ||
      !precioNoche ||
      !desde ||
      !hasta ||
      !huespedes
    ) {
      setMensaje("Completá todos los campos obligatorios.");
      return;
    }

    if (Number(precioNoche) <= 0) {
      setMensaje("El precio por noche debe ser mayor a 0.");
      return;
    }

    if (Number(huespedes) <= 0) {
      setMensaje("La cantidad de huéspedes debe ser mayor a 0.");
      return;
    }

    const cantidadNoches = calcularNoches(desde, hasta);

    if (cantidadNoches <= 0) {
      setMensaje(
        "La fecha de inicio debe ser anterior a la fecha de fin."
      );
      return;
    }

    const total = Number(precioNoche) * cantidadNoches;

    setMensaje(
      `Reserva preparada correctamente. Propiedad: ${propiedad}. ` +
        `Cantidad de noches: ${cantidadNoches}. ` +
        `Total: $${total}. Estado: pendiente.`
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
            Reservar propiedad
          </h1>

          <p className="mt-2 text-gray-600">
            Elegí las fechas de tu estadía y calculá el total de la reserva.
          </p>

          <form
            onSubmit={reservar}
            className="mt-8 space-y-5"
          >
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">
                Propiedad
              </label>

              <input
                type="text"
                value={propiedad}
                onChange={(e) => setPropiedad(e.target.value)}
                placeholder="Ej: Casa en Palermo"
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
                value={precioNoche}
                onChange={(e) => setPrecioNoche(e.target.value)}
                placeholder="Ej: 50000"
                className="w-full rounded-xl border px-4 py-3 text-gray-900 placeholder:text-gray-500 outline-none focus:border-rose-500"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Fecha de inicio
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
                  Fecha de fin
                </label>

                <input
                  type="date"
                  value={hasta}
                  onChange={(e) => setHasta(e.target.value)}
                  className="w-full rounded-xl border px-4 py-3 text-gray-900 outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">
                Cantidad de huéspedes
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

            <button
              type="submit"
              className="w-full rounded-xl bg-rose-500 px-6 py-4 font-semibold text-white hover:bg-rose-600"
            >
              Crear reserva
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