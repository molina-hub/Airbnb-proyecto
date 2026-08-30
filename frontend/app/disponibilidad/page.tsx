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
};

type Propiedad = {
  id: number;
  titulo: string;
  ciudad: string;
  reservas: Reserva[];
};

const propiedadesIniciales: Propiedad[] = [
  {
    id: 1,
    titulo: "Departamento moderno",
    ciudad: "Buenos Aires",
    reservas: [
      {
        id: 1,
        propiedadId: 1,
        fechaInicio: "2026-08-20",
        fechaFin: "2026-08-24",
        estado: "confirmada",
      },
      {
        id: 2,
        propiedadId: 1,
        fechaInicio: "2026-08-27",
        fechaFin: "2026-08-30",
        estado: "pendiente",
      },
      {
        id: 3,
        propiedadId: 1,
        fechaInicio: "2026-08-10",
        fechaFin: "2026-08-12",
        estado: "cancelada",
      },
    ],
  },
  {
    id: 2,
    titulo: "Casa familiar",
    ciudad: "Buenos Aires",
    reservas: [
      {
        id: 4,
        propiedadId: 2,
        fechaInicio: "2026-08-15",
        fechaFin: "2026-08-18",
        estado: "confirmada",
      },
    ],
  },
  {
    id: 3,
    titulo: "Casa con pileta",
    ciudad: "Córdoba",
    reservas: [],
  },
];

function obtenerDiasDelMes(
  año: number,
  mes: number
) {
  return new Date(año, mes + 1, 0).getDate();
}

function crearFechaISO(
  año: number,
  mes: number,
  dia: number
) {
  const mesTexto = String(mes + 1).padStart(2, "0");
  const diaTexto = String(dia).padStart(2, "0");

  return `${año}-${mesTexto}-${diaTexto}`;
}

function fechaEstaOcupada(
  fecha: string,
  reservas: Reserva[]
) {
  return reservas.some((reserva) => {
    if (reserva.estado !== "confirmada") {
      return false;
    }

    return (
      fecha >= reserva.fechaInicio &&
      fecha < reserva.fechaFin
    );
  });
}

function nombreMes(mes: number) {
  const nombres = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  return nombres[mes];
}

function diaSemanaInicial(
  año: number,
  mes: number
) {
  const dia = new Date(año, mes, 1).getDay();

  return dia === 0 ? 6 : dia - 1;
}

function formatearFecha(fecha: string) {
  const partes = fecha.split("-");

  if (partes.length !== 3) {
    return fecha;
  }

  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

export default function DisponibilidadPage() {
  const [propiedadId, setPropiedadId] =
    useState(1);

  const [mesSeleccionado, setMesSeleccionado] =
    useState("2026-08");

  const propiedad = propiedadesIniciales.find(
    (item) => item.id === propiedadId
  );

  const [año, mes] = mesSeleccionado
    .split("-")
    .map(Number);

  const diasDelMes = useMemo(() => {
    if (
      Number.isNaN(año) ||
      Number.isNaN(mes)
    ) {
      return [];
    }

    const cantidad = obtenerDiasDelMes(
      año,
      mes - 1
    );

    return Array.from(
      { length: cantidad },
      (_, indice) => indice + 1
    );
  }, [año, mes]);

  const espaciosIniciales =
    propiedad &&
    !Number.isNaN(año) &&
    !Number.isNaN(mes)
      ? diaSemanaInicial(año, mes - 1)
      : 0;

  const reservasConfirmadas =
    propiedad?.reservas.filter(
      (reserva) =>
        reserva.estado === "confirmada"
    ) ?? [];

  const diasOcupados = diasDelMes.filter(
    (dia) => {
      const fecha = crearFechaISO(
        año,
        mes - 1,
        dia
      );

      return fechaEstaOcupada(
        fecha,
        reservasConfirmadas
      );
    }
  );

  const diasLibres = diasDelMes.filter(
    (dia) => {
      const fecha = crearFechaISO(
        año,
        mes - 1,
        dia
      );

      return !fechaEstaOcupada(
        fecha,
        reservasConfirmadas
      );
    }
  );

  function cambiarMes(
    cantidad: number
  ) {
    const fecha = new Date(
      año,
      mes - 1 + cantidad,
      1
    );

    const nuevoAño = fecha.getFullYear();
    const nuevoMes = String(
      fecha.getMonth() + 1
    ).padStart(2, "0");

    setMesSeleccionado(
      `${nuevoAño}-${nuevoMes}`
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
        <h1 className="text-4xl font-bold text-gray-900">
          Calendario de disponibilidad
        </h1>

        <p className="mt-2 text-gray-600">
          Consultá qué días están libres y ocupados
          para cada propiedad.
        </p>

        <section className="mt-8 rounded-3xl bg-white p-8 shadow">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="propiedad"
                className="mb-2 block font-semibold text-gray-900"
              >
                Propiedad
              </label>

              <select
                id="propiedad"
                value={propiedadId}
                onChange={(event) =>
                  setPropiedadId(
                    Number(event.target.value)
                  )
                }
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-rose-500"
              >
                {propiedadesIniciales.map(
                  (item) => (
                    <option
                      key={item.id}
                      value={item.id}
                    >
                      {item.titulo} -{" "}
                      {item.ciudad}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label
                htmlFor="mes"
                className="mb-2 block font-semibold text-gray-900"
              >
                Mes
              </label>

              <input
                id="mes"
                type="month"
                value={mesSeleccionado}
                onChange={(event) =>
                  setMesSeleccionado(
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-rose-500"
              />
            </div>
          </div>
        </section>

        {propiedad && (
          <section className="mt-8 rounded-3xl bg-white p-8 shadow">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {propiedad.titulo}
                </h2>

                <p className="text-gray-600">
                  {propiedad.ciudad}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    cambiarMes(-1)
                  }
                  className="rounded-xl border border-gray-300 px-4 py-2 font-bold text-gray-900 hover:bg-gray-100"
                  aria-label="Mes anterior"
                >
                  ←
                </button>

                <h3 className="min-w-40 text-center text-xl font-bold text-gray-900">
                  {nombreMes(mes - 1)}{" "}
                  {año}
                </h3>

                <button
                  type="button"
                  onClick={() =>
                    cambiarMes(1)
                  }
                  className="rounded-xl border border-gray-300 px-4 py-2 font-bold text-gray-900 hover:bg-gray-100"
                  aria-label="Mes siguiente"
                >
                  →
                </button>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <span className="h-5 w-5 rounded bg-green-100 border border-green-300" />
                <span className="text-sm font-medium text-gray-700">
                  Libre
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="h-5 w-5 rounded bg-red-100 border border-red-300" />
                <span className="text-sm font-medium text-gray-700">
                  Ocupado
                </span>
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200">
              <div className="grid grid-cols-7 bg-gray-100">
                {[
                  "Lun",
                  "Mar",
                  "Mié",
                  "Jue",
                  "Vie",
                  "Sáb",
                  "Dom",
                ].map((dia) => (
                  <div
                    key={dia}
                    className="border-b border-gray-200 p-3 text-center text-sm font-bold text-gray-700"
                  >
                    {dia}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7">
                {Array.from({
                  length: espaciosIniciales,
                }).map((_, indice) => (
                  <div
                    key={`espacio-${indice}`}
                    className="min-h-24 border-b border-r border-gray-200 bg-gray-50"
                  />
                ))}

                {diasDelMes.map((dia) => {
                  const fecha =
                    crearFechaISO(
                      año,
                      mes - 1,
                      dia
                    );

                  const ocupado =
                    fechaEstaOcupada(
                      fecha,
                      reservasConfirmadas
                    );

                  return (
                    <div
                      key={dia}
                      className={`min-h-24 border-b border-r border-gray-200 p-3 ${
                        ocupado
                          ? "bg-red-50"
                          : "bg-green-50"
                      }`}
                    >
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                          ocupado
                            ? "bg-red-200 text-red-800"
                            : "bg-green-200 text-green-800"
                        }`}
                      >
                        {dia}
                      </div>

                      <p
                        className={`mt-3 text-xs font-semibold ${
                          ocupado
                            ? "text-red-700"
                            : "text-green-700"
                        }`}
                      >
                        {ocupado
                          ? "Ocupado"
                          : "Libre"}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-green-50 p-5">
                <p className="text-sm font-medium text-green-700">
                  Días libres
                </p>

                <p className="mt-1 text-3xl font-bold text-green-800">
                  {diasLibres.length}
                </p>
              </div>

              <div className="rounded-2xl bg-red-50 p-5">
                <p className="text-sm font-medium text-red-700">
                  Días ocupados
                </p>

                <p className="mt-1 text-3xl font-bold text-red-800">
                  {diasOcupados.length}
                </p>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-900">
                Reservas confirmadas del mes
              </h3>

              {reservasConfirmadas.length ===
              0 ? (
                <p className="mt-3 rounded-xl bg-gray-100 p-4 text-gray-600">
                  No hay reservas confirmadas.
                </p>
              ) : (
                <div className="mt-4 space-y-3">
                  {reservasConfirmadas.map(
                    (reserva) => (
                      <div
                        key={reserva.id}
                        className="rounded-2xl bg-gray-100 p-4"
                      >
                        <p className="font-semibold text-gray-900">
                          Reserva #{reserva.id}
                        </p>

                        <p className="mt-1 text-sm text-gray-600">
                          {formatearFecha(
                            reserva.fechaInicio
                          )}{" "}
                          →{" "}
                          {formatearFecha(
                            reserva.fechaFin
                          )}
                        </p>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </section>
        )}
      </section>
    </main>
  );
}