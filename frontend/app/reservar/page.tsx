"use client";

import { FormEvent, useMemo, useState } from "react";
import { api, errorMessage } from "../../lib/api";

type Reserva = {
  id: number;
  propiedad_id: number;
  huesped_id: number;
  fecha_inicio: string;
  fecha_fin: string;
  estado: "pendiente" | "confirmada" | "rechazada" | "cancelada";
  total: number;
};

type Propiedad = {
  id: number;
  titulo: string;
  ciudad: string;
  precio_noche: number;
  capacidad: number;
  anfitrion_id: number;
  reservas: Reserva[];
};

const propiedadesIniciales: Propiedad[] = [
  {
    id: 1,
    titulo: "Departamento moderno",
    ciudad: "Buenos Aires",
    precio_noche: 50000,
    capacidad: 4,
    anfitrion_id: 10,
    reservas: [
      {
        id: 1,
        propiedad_id: 1,
        huesped_id: 20,
        fecha_inicio: "2026-09-10",
        fecha_fin: "2026-09-15",
        estado: "confirmada",
        total: 250000,
      },
    ],
  },
  {
    id: 2,
    titulo: "Casa familiar",
    ciudad: "Buenos Aires",
    precio_noche: 75000,
    capacidad: 6,
    anfitrion_id: 11,
    reservas: [],
  },
  {
    id: 3,
    titulo: "Casa con pileta",
    ciudad: "Córdoba",
    precio_noche: 60000,
    capacidad: 5,
    anfitrion_id: 12,
    reservas: [],
  },
];

const usuarioActual = {
  id: 3,
  nombre: "Juan",
};

function calcularCantidadNoches(
  fechaInicio: string,
  fechaFin: string
) {
  const inicio = new Date(`${fechaInicio}T00:00:00`);
  const fin = new Date(`${fechaFin}T00:00:00`);

  const diferencia = fin.getTime() - inicio.getTime();

  return Math.round(
    diferencia / (1000 * 60 * 60 * 24)
  );
}

function haySolapamiento(
  fechaInicioNueva: string,
  fechaFinNueva: string,
  fechaInicioExistente: string,
  fechaFinExistente: string
) {
  return (
    fechaInicioNueva < fechaFinExistente &&
    fechaFinNueva > fechaInicioExistente
  );
}

export default function ReservarPage() {
  const [propiedades] = useState<
    Propiedad[]
  >(propiedadesIniciales);

  const [propiedadId, setPropiedadId] = useState("");

  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [huespedes, setHuespedes] = useState("1");

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const propiedadSeleccionada = useMemo(() => {
    return propiedades.find(
      (propiedad) =>
        propiedad.id === Number(propiedadId)
    );
  }, [propiedades, propiedadId]);

  const cantidadNoches =
    fechaInicio && fechaFin && fechaInicio < fechaFin
      ? calcularCantidadNoches(
          fechaInicio,
          fechaFin
        )
      : 0;

  const total =
    propiedadSeleccionada && cantidadNoches > 0
      ? propiedadSeleccionada.precio_noche *
        cantidadNoches
      : 0;

  async function crearReserva(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setMensaje("");
    setError("");

    if (!propiedadSeleccionada) {
      setError("Seleccioná una propiedad.");
      return;
    }

    const cantidadHuespedes = Number(huespedes);

    if (
      !huespedes ||
      cantidadHuespedes <= 0
    ) {
      setError(
        "La cantidad de huéspedes debe ser mayor a 0."
      );
      return;
    }

    if (
      cantidadHuespedes >
      propiedadSeleccionada.capacidad
    ) {
      setError(
        `La propiedad admite como máximo ${propiedadSeleccionada.capacidad} huéspedes.`
      );
      return;
    }

    if (!fechaInicio) {
      setError(
        "Seleccioná la fecha de inicio."
      );
      return;
    }

    if (!fechaFin) {
      setError(
        "Seleccioná la fecha de fin."
      );
      return;
    }

    if (fechaInicio >= fechaFin) {
      setError(
        "La fecha de inicio debe ser anterior a la fecha de fin."
      );
      return;
    }

    if (cantidadNoches <= 0) {
      setError(
        "El rango seleccionado debe tener al menos una noche."
      );
      return;
    }

    const reservaSolapada =
      propiedadSeleccionada.reservas.some(
        (reserva) => {
          if (
            reserva.estado !== "confirmada"
          ) {
            return false;
          }

          return haySolapamiento(
            fechaInicio,
            fechaFin,
            reserva.fecha_inicio,
            reserva.fecha_fin
          );
        }
      );

    if (reservaSolapada) {
      setError(
        "La propiedad no está disponible para las fechas seleccionadas."
      );
      return;
    }

    if (
      propiedadSeleccionada.anfitrion_id ===
      usuarioActual.id
    ) {
      setError(
        "No podés reservar tu propia propiedad."
      );
      return;
    }

    try {
      const nuevaReserva = await api<Reserva>("/reservas", {
        method: "POST",
        body: JSON.stringify({ propiedad_id: propiedadSeleccionada.id, huesped_id: usuarioActual.id, fecha_inicio: fechaInicio, fecha_fin: fechaFin }),
      });
      setMensaje(`Reserva creada correctamente. Estado: pendiente. Total: $${Number(nuevaReserva.total).toLocaleString("es-AR")}.`);
      setFechaInicio(""); setFechaFin(""); setHuespedes("1");
    } catch (cause) {
      setError(errorMessage(cause));
    }
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

      <section className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-900">
          Crear reserva
        </h1>

        <p className="mt-2 text-gray-600">
          Seleccioná una propiedad y las fechas de tu estadía.
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl bg-white p-8 shadow">
            <h2 className="text-2xl font-bold text-gray-900">
              Datos de la reserva
            </h2>

            <form
              onSubmit={crearReserva}
              className="mt-6 space-y-6"
            >
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
                  onChange={event =>
                    setPropiedadId(
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-rose-500"
                >
                  <option value="">
                    Seleccioná una propiedad
                  </option>

                  {propiedades.map(
                    propiedad => (
                      <option
                        key={propiedad.id}
                        value={propiedad.id}
                      >
                        {propiedad.titulo} -{" "}
                        {propiedad.ciudad} - $
                        {propiedad.precio_noche.toLocaleString(
                          "es-AR"
                        )}
                        /noche
                      </option>
                    )
                  )}
                </select>
              </div>

              {propiedadSeleccionada && (
                <div className="rounded-2xl bg-gray-100 p-5">
                  <h3 className="font-bold text-gray-900">
                    {propiedadSeleccionada.titulo}
                  </h3>

                  <p className="mt-1 text-gray-600">
                    {propiedadSeleccionada.ciudad}
                  </p>

                  <p className="mt-2 font-semibold text-gray-900">
                    $
                    {propiedadSeleccionada.precio_noche.toLocaleString(
                      "es-AR"
                    )}{" "}
                    por noche
                  </p>

                  <p className="mt-1 text-sm text-gray-600">
                    Capacidad máxima:{" "}
                    {propiedadSeleccionada.capacidad} huéspedes
                  </p>
                </div>
              )}

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="fechaInicio"
                    className="mb-2 block font-semibold text-gray-900"
                  >
                    Fecha de inicio
                  </label>

                  <input
                    id="fechaInicio"
                    type="date"
                    value={fechaInicio}
                    onChange={event =>
                      setFechaInicio(
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="fechaFin"
                    className="mb-2 block font-semibold text-gray-900"
                  >
                    Fecha de fin
                  </label>

                  <input
                    id="fechaFin"
                    type="date"
                    value={fechaFin}
                    onChange={event =>
                      setFechaFin(
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="huespedes"
                  className="mb-2 block font-semibold text-gray-900"
                >
                  Cantidad de huéspedes
                </label>

                <input
                  id="huespedes"
                  type="number"
                  min="1"
                  value={huespedes}
                  onChange={event =>
                    setHuespedes(
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-rose-500"
                />
              </div>

              {error && (
                <div className="rounded-xl bg-red-100 p-4 font-medium text-red-700">
                  {error}
                </div>
              )}

              {mensaje && (
                <div className="rounded-xl bg-green-100 p-4 font-medium text-green-700">
                  {mensaje}
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded-xl bg-rose-500 px-6 py-3 font-semibold text-white hover:bg-rose-600"
              >
                Crear reserva
              </button>
            </form>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow">
            <h2 className="text-2xl font-bold text-gray-900">
              Resumen
            </h2>

            {!propiedadSeleccionada ? (
              <div className="mt-6 rounded-2xl bg-gray-100 p-6 text-gray-600">
                Seleccioná una propiedad para ver el resumen.
              </div>
            ) : (
              <div className="mt-6 space-y-5">
                <div>
                  <p className="text-sm text-gray-500">
                    Propiedad
                  </p>

                  <p className="font-bold text-gray-900">
                    {propiedadSeleccionada.titulo}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Precio por noche
                  </p>

                  <p className="font-semibold text-gray-900">
                    $
                    {propiedadSeleccionada.precio_noche.toLocaleString(
                      "es-AR"
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Cantidad de noches
                  </p>

                  <p className="font-semibold text-gray-900">
                    {cantidadNoches}
                  </p>
                </div>

                <div className="border-t pt-5">
                  <p className="text-sm text-gray-500">
                    Total
                  </p>

                  <p className="text-3xl font-bold text-gray-900">
                    $
                    {total.toLocaleString(
                      "es-AR"
                    )}
                  </p>
                </div>

                <div className="rounded-2xl bg-yellow-50 p-5">
                  <p className="font-semibold text-yellow-800">
                    Estado inicial
                  </p>

                  <p className="mt-1 text-yellow-700">
                    La reserva se crea en estado
                    <strong> pendiente</strong>.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
