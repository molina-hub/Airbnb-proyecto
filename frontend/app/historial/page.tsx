"use client";

import { useState } from "react";

type EstadoReserva =
  | "pendiente"
  | "confirmada"
  | "rechazada"
  | "cancelada";

type Reserva = {
  id: number;
  propiedad: string;
  ciudad: string;
  desde: string;
  hasta: string;
  huespedes: number;
  total: number;
  estado: EstadoReserva;
};

const reservasIniciales: Reserva[] = [
  {
    id: 1,
    propiedad: "Casa con pileta",
    ciudad: "Buenos Aires",
    desde: "10/09/2026",
    hasta: "15/09/2026",
    huespedes: 2,
    total: 250000,
    estado: "confirmada",
  },
  {
    id: 2,
    propiedad: "Departamento moderno",
    ciudad: "Córdoba",
    desde: "20/10/2026",
    hasta: "24/10/2026",
    huespedes: 2,
    total: 160000,
    estado: "pendiente",
  },
  {
    id: 3,
    propiedad: "Casa cerca del centro",
    ciudad: "Mendoza",
    desde: "05/08/2026",
    hasta: "08/08/2026",
    huespedes: 3,
    total: 180000,
    estado: "rechazada",
  },
];

export default function Historial() {
  const [reservas, setReservas] =
    useState<Reserva[]>(reservasIniciales);

  const [filtro, setFiltro] = useState<EstadoReserva | "todas">(
    "todas"
  );

  function cancelarReserva(id: number) {
    const confirmar = window.confirm(
      "¿Seguro que querés cancelar esta reserva?"
    );

    if (!confirmar) {
      return;
    }

    setReservas(
      reservas.map((reserva) =>
        reserva.id === id
          ? {
              ...reserva,
              estado: "cancelada",
            }
          : reserva
      )
    );
  }

  function obtenerColorEstado(estado: EstadoReserva) {
    if (estado === "confirmada") {
      return "bg-green-100 text-green-700";
    }

    if (estado === "pendiente") {
      return "bg-yellow-100 text-yellow-700";
    }

    if (estado === "rechazada") {
      return "bg-red-100 text-red-700";
    }

    return "bg-gray-200 text-gray-700";
  }

  const reservasFiltradas =
    filtro === "todas"
      ? reservas
      : reservas.filter((reserva) => reserva.estado === filtro);

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
        <h1 className="text-4xl font-bold text-gray-900">
          Historial de reservas
        </h1>

        <p className="mt-2 text-gray-600">
          Consultá tus reservas y su estado actual.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            onClick={() => setFiltro("todas")}
            className={`rounded-xl px-5 py-3 font-semibold ${
              filtro === "todas"
                ? "bg-rose-500 text-white"
                : "bg-white text-gray-900"
            }`}
          >
            Todas
          </button>

          <button
            onClick={() => setFiltro("pendiente")}
            className={`rounded-xl px-5 py-3 font-semibold ${
              filtro === "pendiente"
                ? "bg-rose-500 text-white"
                : "bg-white text-gray-900"
            }`}
          >
            Pendientes
          </button>

          <button
            onClick={() => setFiltro("confirmada")}
            className={`rounded-xl px-5 py-3 font-semibold ${
              filtro === "confirmada"
                ? "bg-rose-500 text-white"
                : "bg-white text-gray-900"
            }`}
          >
            Confirmadas
          </button>

          <button
            onClick={() => setFiltro("rechazada")}
            className={`rounded-xl px-5 py-3 font-semibold ${
              filtro === "rechazada"
                ? "bg-rose-500 text-white"
                : "bg-white text-gray-900"
            }`}
          >
            Rechazadas
          </button>

          <button
            onClick={() => setFiltro("cancelada")}
            className={`rounded-xl px-5 py-3 font-semibold ${
              filtro === "cancelada"
                ? "bg-rose-500 text-white"
                : "bg-white text-gray-900"
            }`}
          >
            Canceladas
          </button>
        </div>

        <div className="mt-8 space-y-6">
          {reservasFiltradas.length === 0 ? (
            <div className="rounded-3xl bg-white p-8 text-center shadow">
              <p className="text-gray-600">
                No hay reservas con este estado.
              </p>
            </div>
          ) : (
            reservasFiltradas.map((reserva) => (
              <div
                key={reserva.id}
                className="rounded-3xl bg-white p-6 shadow"
              >
                <div className="flex flex-col justify-between gap-4 md:flex-row">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {reserva.propiedad}
                    </h2>

                    <p className="mt-1 text-gray-600">
                      {reserva.ciudad}
                    </p>
                  </div>

                  <span
                    className={`h-fit rounded-full px-4 py-2 text-sm font-bold ${obtenerColorEstado(
                      reserva.estado
                    )}`}
                  >
                    {reserva.estado}
                  </span>
                </div>

                <div className="mt-6 grid gap-4 border-t pt-6 md:grid-cols-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      Entrada
                    </p>

                    <p className="mt-1 font-semibold text-gray-900">
                      {reserva.desde}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Salida
                    </p>

                    <p className="mt-1 font-semibold text-gray-900">
                      {reserva.hasta}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Huéspedes
                    </p>

                    <p className="mt-1 font-semibold text-gray-900">
                      {reserva.huespedes}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Total
                    </p>

                    <p className="mt-1 font-semibold text-gray-900">
                      ${reserva.total}
                    </p>
                  </div>
                </div>

                {reserva.estado === "confirmada" && (
                  <div className="mt-6 border-t pt-6">
                    <button
                      onClick={() => cancelarReserva(reserva.id)}
                      className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700"
                    >
                      Cancelar reserva
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}