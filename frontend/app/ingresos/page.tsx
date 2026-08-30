"use client";

import { useMemo, useState } from "react";

type EstadoReserva =
  | "pendiente"
  | "confirmada"
  | "rechazada"
  | "cancelada";

type Reserva = {
  id: number;
  propiedadId: number;
  fechaInicio: string;
  fechaFin: string;
  estado: EstadoReserva;
  total: number;
};

type Propiedad = {
  id: number;
  titulo: string;
  ciudad: string;
  precioNoche: number;
};

type Anfitrion = {
  id: number;
  nombre: string;
  propiedades: Propiedad[];
};

const anfitriones: Anfitrion[] = [
  {
    id: 1,
    nombre: "Carlos",
    propiedades: [
      {
        id: 1,
        titulo: "Departamento moderno",
        ciudad: "Buenos Aires",
        precioNoche: 50000,
      },
      {
        id: 2,
        titulo: "Casa familiar",
        ciudad: "Buenos Aires",
        precioNoche: 75000,
      },
    ],
  },
  {
    id: 2,
    nombre: "María",
    propiedades: [
      {
        id: 3,
        titulo: "Casa con pileta",
        ciudad: "Córdoba",
        precioNoche: 60000,
      },
      {
        id: 4,
        titulo: "Cabaña de montaña",
        ciudad: "Bariloche",
        precioNoche: 90000,
      },
    ],
  },
];

const reservas: Reserva[] = [
  {
    id: 1,
    propiedadId: 1,
    fechaInicio: "2026-08-01",
    fechaFin: "2026-08-05",
    estado: "confirmada",
    total: 200000,
  },
  {
    id: 2,
    propiedadId: 1,
    fechaInicio: "2026-08-10",
    fechaFin: "2026-08-14",
    estado: "confirmada",
    total: 200000,
  },
  {
    id: 3,
    propiedadId: 2,
    fechaInicio: "2026-08-05",
    fechaFin: "2026-08-08",
    estado: "confirmada",
    total: 225000,
  },
  {
    id: 4,
    propiedadId: 2,
    fechaInicio: "2026-08-15",
    fechaFin: "2026-08-18",
    estado: "pendiente",
    total: 225000,
  },
  {
    id: 5,
    propiedadId: 3,
    fechaInicio: "2026-08-03",
    fechaFin: "2026-08-06",
    estado: "confirmada",
    total: 180000,
  },
  {
    id: 6,
    propiedadId: 3,
    fechaInicio: "2026-08-12",
    fechaFin: "2026-08-16",
    estado: "cancelada",
    total: 240000,
  },
  {
    id: 7,
    propiedadId: 4,
    fechaInicio: "2026-08-20",
    fechaFin: "2026-08-25",
    estado: "confirmada",
    total: 450000,
  },
];

function formatearDinero(valor: number) {
  return valor.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });
}

function formatearFecha(fecha: string) {
  const partes = fecha.split("-");

  if (partes.length !== 3) {
    return fecha;
  }

  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

export default function IngresosPage() {
  const [anfitrionId, setAnfitrionId] = useState(1);

  const [desde, setDesde] = useState("2026-08-01");

  const [hasta, setHasta] = useState("2026-08-31");

  const [busquedaRealizada, setBusquedaRealizada] =
    useState(false);

  const [error, setError] = useState("");

  const anfitrion = anfitriones.find(
    (item) => item.id === anfitrionId
  );

  const reservasDelAnfitrion = useMemo(() => {
    if (!anfitrion) {
      return [];
    }

    const idsPropiedades =
      anfitrion.propiedades.map(
        (propiedad) => propiedad.id
      );

    return reservas.filter(
      (reserva) =>
        idsPropiedades.includes(
          reserva.propiedadId
        )
    );
  }, [anfitrion]);

  const reservasFacturadas = useMemo(() => {
    if (!desde || !hasta) {
      return [];
    }

    return reservasDelAnfitrion.filter(
      (reserva) => {
        if (reserva.estado !== "confirmada") {
          return false;
        }

        return (
          reserva.fechaFin >= desde &&
          reserva.fechaFin <= hasta
        );
      }
    );
  }, [
    reservasDelAnfitrion,
    desde,
    hasta,
  ]);

  const totalFacturado =
    reservasFacturadas.reduce(
      (total, reserva) =>
        total + reserva.total,
      0
    );

  const detallePorPropiedad =
    anfitrion?.propiedades.map(
      (propiedad) => {
        const reservasPropiedad =
          reservasFacturadas.filter(
            (reserva) =>
              reserva.propiedadId ===
              propiedad.id
          );

        const total =
          reservasPropiedad.reduce(
            (suma, reserva) =>
              suma + reserva.total,
            0
          );

        return {
          propiedad,
          reservas: reservasPropiedad,
          total,
        };
      }
    ) ?? [];

  function consultarIngresos() {
    setError("");

    if (!desde || !hasta) {
      setError(
        "Debés seleccionar una fecha desde y una fecha hasta."
      );
      return;
    }

    if (desde > hasta) {
      setError(
        "La fecha desde no puede ser posterior a la fecha hasta."
      );
      return;
    }

    setBusquedaRealizada(true);
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
            Ingresos del anfitrión
          </h1>

          <p className="mt-2 text-gray-600">
            Consultá cuánto facturaste en un período
            determinado.
          </p>
        </div>

        <section className="mt-8 rounded-3xl bg-white p-8 shadow">
          <h2 className="text-2xl font-bold text-gray-900">
            Seleccionar período
          </h2>

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <div>
              <label
                htmlFor="anfitrion"
                className="mb-2 block font-semibold text-gray-900"
              >
                Anfitrión
              </label>

              <select
                id="anfitrion"
                value={anfitrionId}
                onChange={(event) => {
                  setAnfitrionId(
                    Number(event.target.value)
                  );
                  setBusquedaRealizada(false);
                }}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-rose-500"
              >
                {anfitriones.map(
                  (item) => (
                    <option
                      key={item.id}
                      value={item.id}
                    >
                      {item.nombre}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label
                htmlFor="desde"
                className="mb-2 block font-semibold text-gray-900"
              >
                Desde
              </label>

              <input
                id="desde"
                type="date"
                value={desde}
                onChange={(event) => {
                  setDesde(
                    event.target.value
                  );
                  setBusquedaRealizada(false);
                }}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label
                htmlFor="hasta"
                className="mb-2 block font-semibold text-gray-900"
              >
                Hasta
              </label>

              <input
                id="hasta"
                type="date"
                value={hasta}
                onChange={(event) => {
                  setHasta(
                    event.target.value
                  );
                  setBusquedaRealizada(false);
                }}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-rose-500"
              />
            </div>
          </div>

          {error && (
            <div className="mt-6 rounded-xl bg-red-100 p-4 font-medium text-red-700">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={consultarIngresos}
            className="mt-6 rounded-xl bg-rose-500 px-6 py-3 font-semibold text-white hover:bg-rose-600"
          >
            Consultar ingresos
          </button>
        </section>

        {busquedaRealizada && (
          <>
            <section className="mt-8">
              <div className="rounded-3xl bg-white p-8 shadow">
                <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Total facturado
                </p>

                <p className="mt-2 text-5xl font-bold text-gray-900">
                  {formatearDinero(
                    totalFacturado
                  )}
                </p>

                <p className="mt-3 text-gray-600">
                  {anfitrion?.nombre} ·{" "}
                  {formatearFecha(desde)}{" "}
                  hasta{" "}
                  {formatearFecha(hasta)}
                </p>
              </div>
            </section>

            <section className="mt-8 rounded-3xl bg-white p-8 shadow">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Detalle por propiedad
                  </h2>

                  <p className="mt-1 text-gray-600">
                    Solo se muestran reservas confirmadas
                    cuyo fin está dentro del período.
                  </p>
                </div>

                <span className="rounded-full bg-gray-100 px-4 py-2 font-semibold text-gray-700">
                  {reservasFacturadas.length}{" "}
                  reservas
                </span>
              </div>

              <div className="mt-6 space-y-5">
                {detallePorPropiedad.map(
                  (detalle) => (
                    <article
                      key={detalle.propiedad.id}
                      className="rounded-2xl border border-gray-200 p-6"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">
                            {
                              detalle.propiedad
                                .titulo
                            }
                          </h3>

                          <p className="text-gray-600">
                            {
                              detalle.propiedad
                                .ciudad
                            }
                          </p>
                        </div>

                        <div className="text-left sm:text-right">
                          <p className="text-sm text-gray-500">
                            Total
                          </p>

                          <p className="text-2xl font-bold text-gray-900">
                            {formatearDinero(
                              detalle.total
                            )}
                          </p>
                        </div>
                      </div>

                      {detalle.reservas.length ===
                      0 ? (
                        <p className="mt-4 rounded-xl bg-gray-100 p-4 text-sm text-gray-600">
                          No hay reservas confirmadas
                          facturadas para esta propiedad
                          en el período seleccionado.
                        </p>
                      ) : (
                        <div className="mt-5 space-y-3">
                          {detalle.reservas.map(
                            (reserva) => (
                              <div
                                key={reserva.id}
                                className="flex flex-col gap-2 rounded-xl bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                              >
                                <div>
                                  <p className="font-semibold text-gray-900">
                                    Reserva #
                                    {
                                      reserva.id
                                    }
                                  </p>

                                  <p className="text-sm text-gray-600">
                                    {formatearFecha(
                                      reserva.fechaInicio
                                    )}{" "}
                                    →{" "}
                                    {formatearFecha(
                                      reserva.fechaFin
                                    )}
                                  </p>

                                  <span className="mt-2 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                                    Confirmada
                                  </span>
                                </div>

                                <p className="text-lg font-bold text-gray-900">
                                  {formatearDinero(
                                    reserva.total
                                  )}
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </article>
                  )
                )}
              </div>
            </section>

            <section className="mt-8 rounded-3xl bg-white p-8 shadow">
              <h2 className="text-2xl font-bold text-gray-900">
                Resumen
              </h2>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-gray-100 p-5">
                  <p className="text-sm text-gray-600">
                    Propiedades
                  </p>

                  <p className="mt-1 text-3xl font-bold text-gray-900">
                    {anfitrion?.propiedades.length ??
                      0}
                  </p>
                </div>

                <div className="rounded-2xl bg-gray-100 p-5">
                  <p className="text-sm text-gray-600">
                    Reservas facturadas
                  </p>

                  <p className="mt-1 text-3xl font-bold text-gray-900">
                    {reservasFacturadas.length}
                  </p>
                </div>

                <div className="rounded-2xl bg-gray-100 p-5">
                  <p className="text-sm text-gray-600">
                    Total
                  </p>

                  <p className="mt-1 text-2xl font-bold text-gray-900">
                    {formatearDinero(
                      totalFacturado
                    )}
                  </p>
                </div>
              </div>
            </section>
          </>
        )}
      </section>
    </main>
  );
}