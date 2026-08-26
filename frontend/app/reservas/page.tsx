"use client";

import { useState } from "react";

type EstadoReserva =
  | "pendiente"
  | "confirmada"
  | "rechazada"
  | "cancelada";

type Reserva = {
  id: number;
  propiedadId: number;
  propiedad: string;
  huesped: string;
  fechaInicio: string;
  fechaFin: string;
  total: number;
  estado: EstadoReserva;
};

const reservasIniciales: Reserva[] = [
  {
    id: 1,
    propiedadId: 1,
    propiedad: "Departamento moderno",
    huesped: "Juan",
    fechaInicio: "2026-09-05",
    fechaFin: "2026-09-10",
    total: 250000,
    estado: "pendiente",
  },
  {
    id: 2,
    propiedadId: 2,
    propiedad: "Casa familiar",
    huesped: "María",
    fechaInicio: "2026-09-15",
    fechaFin: "2026-09-20",
    total: 375000,
    estado: "confirmada",
  },
  {
    id: 3,
    propiedadId: 3,
    propiedad: "Casa con pileta",
    huesped: "Pedro",
    fechaInicio: "2026-09-22",
    fechaFin: "2026-09-25",
    total: 180000,
    estado: "pendiente",
  },
];

const anfitrionActual = {
  id: 10,
  nombre: "Anfitrión actual",
  propiedades: [1, 2, 3],
};

function formatearFecha(fecha: string) {
  const partes = fecha.split("-");

  if (partes.length !== 3) {
    return fecha;
  }

  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function obtenerDiasHasta(
  fechaObjetivo: string
) {
  const ahora = new Date();
  const objetivo = new Date(
    `${fechaObjetivo}T00:00:00`
  );

  ahora.setHours(0, 0, 0, 0);

  const diferencia =
    objetivo.getTime() - ahora.getTime();

  return Math.ceil(
    diferencia / (1000 * 60 * 60 * 24)
  );
}

function obtenerEstadoVisual(
  estado: EstadoReserva
) {
  if (estado === "pendiente") {
    return "bg-yellow-100 text-yellow-800";
  }

  if (estado === "confirmada") {
    return "bg-green-100 text-green-800";
  }

  if (estado === "rechazada") {
    return "bg-red-100 text-red-800";
  }

  return "bg-gray-100 text-gray-800";
}

function obtenerTextoEstado(
  estado: EstadoReserva
) {
  if (estado === "pendiente") {
    return "Pendiente";
  }

  if (estado === "confirmada") {
    return "Confirmada";
  }

  if (estado === "rechazada") {
    return "Rechazada";
  }

  return "Cancelada";
}

export default function ReservasPage() {
  const [reservas, setReservas] = useState<
    Reserva[]
  >(reservasIniciales);

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  function limpiarMensajes() {
    setMensaje("");
    setError("");
  }

  function confirmarReserva(
    reservaId: number
  ) {
    limpiarMensajes();

    const reserva = reservas.find(
      (item) => item.id === reservaId
    );

    if (!reserva) {
      setError("La reserva no existe.");
      return;
    }

    if (
      !anfitrionActual.propiedades.includes(
        reserva.propiedadId
      )
    ) {
      setError(
        "Solo el anfitrión dueño de la propiedad puede confirmar la reserva."
      );
      return;
    }

    if (reserva.estado !== "pendiente") {
      setError(
        "Solo se pueden confirmar reservas pendientes."
      );
      return;
    }

    setReservas((reservasActuales) =>
      reservasActuales.map((item) =>
        item.id === reservaId
          ? {
              ...item,
              estado: "confirmada",
            }
          : item
      )
    );

    setMensaje(
      "La reserva fue confirmada correctamente."
    );
  }

  function rechazarReserva(
    reservaId: number
  ) {
    limpiarMensajes();

    const reserva = reservas.find(
      (item) => item.id === reservaId
    );

    if (!reserva) {
      setError("La reserva no existe.");
      return;
    }

    if (
      !anfitrionActual.propiedades.includes(
        reserva.propiedadId
      )
    ) {
      setError(
        "Solo el anfitrión dueño de la propiedad puede rechazar la reserva."
      );
      return;
    }

    if (reserva.estado !== "pendiente") {
      setError(
        "Solo se pueden rechazar reservas pendientes."
      );
      return;
    }

    setReservas((reservasActuales) =>
      reservasActuales.map((item) =>
        item.id === reservaId
          ? {
              ...item,
              estado: "rechazada",
            }
          : item
      )
    );

    setMensaje(
      "La reserva fue rechazada correctamente."
    );
  }

  function cancelarReserva(
    reservaId: number
  ) {
    limpiarMensajes();

    const reserva = reservas.find(
      (item) => item.id === reservaId
    );

    if (!reserva) {
      setError("La reserva no existe.");
      return;
    }

    if (
      !anfitrionActual.propiedades.includes(
        reserva.propiedadId
      )
    ) {
      setError(
        "Solo el anfitrión dueño de la propiedad puede cancelar la reserva."
      );
      return;
    }

    if (reserva.estado !== "confirmada") {
      setError(
        "Solo se pueden cancelar reservas confirmadas."
      );
      return;
    }

    const diasHastaInicio =
      obtenerDiasHasta(reserva.fechaInicio);

    setReservas((reservasActuales) =>
      reservasActuales.map((item) => {
        if (item.id !== reservaId) {
          return item;
        }

        return {
          ...item,
          estado: "cancelada",
        };
      })
    );

    if (diasHastaInicio < 2) {
      setMensaje(
        "La reserva fue cancelada. Por realizarse con menos de 48 horas de antelación, corresponde una pérdida del 100% del total."
      );
      return;
    }

    if (diasHastaInicio < 7) {
      setMensaje(
        "La reserva fue cancelada. Por realizarse con menos de 7 días de antelación, corresponde una pérdida del 50% del total."
      );
      return;
    }

    setMensaje(
      "La reserva fue cancelada correctamente. No corresponde penalización por la anticipación de la cancelación."
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
            className="font-medium text-gray-900 hover:text-rose-500"
          >
            Volver al inicio
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            Gestionar reservas
          </h1>

          <p className="mt-2 text-gray-600">
            Como anfitrión, podés aceptar, rechazar o cancelar
            las reservas de tus propiedades.
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-xl bg-red-100 p-4 font-medium text-red-700">
            {error}
          </div>
        )}

        {mensaje && (
          <div className="mt-6 rounded-xl bg-green-100 p-4 font-medium text-green-700">
            {mensaje}
          </div>
        )}

        <div className="mt-8 space-y-5">
          {reservas.length === 0 ? (
            <div className="rounded-3xl bg-white p-8 text-center shadow">
              <h2 className="text-xl font-bold text-gray-900">
                No hay reservas
              </h2>
            </div>
          ) : (
            reservas.map((reserva) => (
              <article
                key={reserva.id}
                className="rounded-3xl bg-white p-6 shadow"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {reserva.propiedad}
                      </h2>

                      <span
                        className={`rounded-full px-3 py-1 text-sm font-semibold ${obtenerEstadoVisual(
                          reserva.estado
                        )}`}
                      >
                        {obtenerTextoEstado(
                          reserva.estado
                        )}
                      </span>
                    </div>

                    <div className="mt-5 grid gap-3 text-gray-700 sm:grid-cols-2">
                      <p>
                        <strong>Huésped:</strong>{" "}
                        {reserva.huesped}
                      </p>

                      <p>
                        <strong>Reserva:</strong> #
                        {reserva.id}
                      </p>

                      <p>
                        <strong>Desde:</strong>{" "}
                        {formatearFecha(
                          reserva.fechaInicio
                        )}
                      </p>

                      <p>
                        <strong>Hasta:</strong>{" "}
                        {formatearFecha(
                          reserva.fechaFin
                        )}
                      </p>

                      <p>
                        <strong>Total:</strong> $
                        {reserva.total.toLocaleString(
                          "es-AR"
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 lg:min-w-52">
                    {reserva.estado ===
                      "pendiente" && (
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            confirmarReserva(
                              reserva.id
                            )
                          }
                          className="rounded-xl bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700"
                        >
                          Confirmar
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            rechazarReserva(
                              reserva.id
                            )
                          }
                          className="rounded-xl bg-red-500 px-5 py-3 font-semibold text-white hover:bg-red-600"
                        >
                          Rechazar
                        </button>
                      </>
                    )}

                    {reserva.estado ===
                      "confirmada" && (
                      <button
                        type="button"
                        onClick={() =>
                          cancelarReserva(
                            reserva.id
                          )
                        }
                        className="rounded-xl bg-gray-800 px-5 py-3 font-semibold text-white hover:bg-gray-900"
                      >
                        Cancelar
                      </button>
                    )}

                    {reserva.estado ===
                      "rechazada" && (
                      <p className="rounded-xl bg-gray-100 p-3 text-center text-sm font-medium text-gray-600">
                        Reserva rechazada
                      </p>
                    )}

                    {reserva.estado ===
                      "cancelada" && (
                      <p className="rounded-xl bg-gray-100 p-3 text-center text-sm font-medium text-gray-600">
                        Reserva cancelada
                      </p>
                    )}
                  </div>
                </div>

                {reserva.estado ===
                  "confirmada" && (
                  <div className="mt-5 rounded-2xl bg-green-50 p-4 text-sm text-green-800">
                    Una reserva confirmada puede pasar a
                    estado cancelada.
                  </div>
                )}

                {reserva.estado ===
                  "pendiente" && (
                  <div className="mt-5 rounded-2xl bg-yellow-50 p-4 text-sm text-yellow-800">
                    Esta reserva puede pasar a
                    confirmada o rechazada.
                  </div>
                )}
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}