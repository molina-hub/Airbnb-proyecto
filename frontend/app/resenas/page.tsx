"use client";

import { FormEvent, useState } from "react";

type Reserva = {
  id: number;
  propiedadId: number;
  propiedad: string;
  huespedId: number;
  fechaFin: string;
  estado: "pendiente" | "confirmada" | "rechazada" | "cancelada";
  resenaCreada: boolean;
};

type Resena = {
  id: number;
  reservaId: number;
  propiedadId: number;
  autorId: number;
  puntaje: number;
  comentario: string;
  fecha: string;
};

const usuarioActual = {
  id: 20,
  nombre: "Juan",
};

const reservasIniciales: Reserva[] = [
  {
    id: 1,
    propiedadId: 1,
    propiedad: "Departamento moderno",
    huespedId: 20,
    fechaFin: "2026-08-10",
    estado: "confirmada",
    resenaCreada: false,
  },
  {
    id: 2,
    propiedadId: 2,
    propiedad: "Casa familiar",
    huespedId: 20,
    fechaFin: "2026-09-15",
    estado: "confirmada",
    resenaCreada: false,
  },
  {
    id: 3,
    propiedadId: 3,
    propiedad: "Casa con pileta",
    huespedId: 20,
    fechaFin: "2026-07-20",
    estado: "confirmada",
    resenaCreada: true,
  },
  {
    id: 4,
    propiedadId: 4,
    propiedad: "Departamento céntrico",
    huespedId: 20,
    fechaFin: "2026-07-10",
    estado: "pendiente",
    resenaCreada: false,
  },
];

const resenasIniciales: Resena[] = [
  {
    id: 1,
    reservaId: 3,
    propiedadId: 3,
    autorId: 20,
    puntaje: 5,
    comentario: "Excelente alojamiento.",
    fecha: "2026-07-21",
  },
];

function estadiaFinalizada(fechaFin: string) {
  const hoy = new Date();
  const fin = new Date(`${fechaFin}T00:00:00`);

  hoy.setHours(0, 0, 0, 0);

  return fin < hoy;
}

function formatearFecha(fecha: string) {
  const partes = fecha.split("-");

  if (partes.length !== 3) {
    return fecha;
  }

  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

export default function ResenasPage() {
  const [reservas, setReservas] = useState<Reserva[]>(
    reservasIniciales
  );

  const [resenas, setResenas] = useState<Resena[]>(
    resenasIniciales
  );

  const [reservaSeleccionada, setReservaSeleccionada] =
    useState<number | null>(null);

  const [puntaje, setPuntaje] = useState(0);
  const [comentario, setComentario] = useState("");

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const reservasResenables = reservas.filter((reserva) => {
    return (
      reserva.huespedId === usuarioActual.id &&
      reserva.estado === "confirmada" &&
      estadiaFinalizada(reserva.fechaFin) &&
      !reserva.resenaCreada
    );
  });

  function seleccionarReserva(reservaId: number) {
    setReservaSeleccionada(reservaId);
    setPuntaje(0);
    setComentario("");
    setMensaje("");
    setError("");
  }

  function crearResena(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMensaje("");
    setError("");

    if (reservaSeleccionada === null) {
      setError("Seleccioná una estadía.");
      return;
    }

    const reserva = reservas.find(
      (item) => item.id === reservaSeleccionada
    );

    if (!reserva) {
      setError("La reserva seleccionada no existe.");
      return;
    }

    if (reserva.huespedId !== usuarioActual.id) {
      setError(
        "Solo el huésped de la reserva puede dejar una reseña."
      );
      return;
    }

    if (reserva.estado !== "confirmada") {
      setError(
        "Solo se pueden reseñar reservas confirmadas."
      );
      return;
    }

    if (!estadiaFinalizada(reserva.fechaFin)) {
      setError(
        "Todavía no podés reseñar esta estadía porque no terminó."
      );
      return;
    }

    if (reserva.resenaCreada) {
      setError(
        "Esta reserva ya tiene una reseña."
      );
      return;
    }

    if (
      !Number.isInteger(puntaje) ||
      puntaje < 1 ||
      puntaje > 5
    ) {
      setError(
        "El puntaje debe estar entre 1 y 5."
      );
      return;
    }

    const nuevaResena: Resena = {
      id: Date.now(),
      reservaId: reserva.id,
      propiedadId: reserva.propiedadId,
      autorId: usuarioActual.id,
      puntaje,
      comentario: comentario.trim(),
      fecha: new Date()
        .toISOString()
        .split("T")[0],
    };

    setResenas((resenasActuales) => [
      ...resenasActuales,
      nuevaResena,
    ]);

    setReservas((reservasActuales) =>
      reservasActuales.map((item) =>
        item.id === reserva.id
          ? {
              ...item,
              resenaCreada: true,
            }
          : item
      )
    );

    setReservaSeleccionada(null);
    setPuntaje(0);
    setComentario("");

    setMensaje(
      "La reseña fue creada correctamente."
    );
  }

  function obtenerResenasPropiedad(
    propiedadId: number
  ) {
    return resenas.filter(
      (resena) =>
        resena.propiedadId === propiedadId
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
          Mis reseñas
        </h1>

        <p className="mt-2 text-gray-600">
          Dejá una reseña después de completar tu estadía.
        </p>

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

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <section className="rounded-3xl bg-white p-6 shadow">
            <h2 className="text-2xl font-bold text-gray-900">
              Estadías disponibles para reseñar
            </h2>

            <div className="mt-6 space-y-4">
              {reservasResenables.length === 0 ? (
                <div className="rounded-2xl bg-gray-100 p-5 text-gray-600">
                  No tenés estadías disponibles para reseñar.
                </div>
              ) : (
                reservasResenables.map((reserva) => (
                  <button
                    key={reserva.id}
                    type="button"
                    onClick={() =>
                      seleccionarReserva(reserva.id)
                    }
                    className={`w-full rounded-2xl border p-5 text-left transition ${
                      reservaSeleccionada === reserva.id
                        ? "border-rose-500 bg-rose-50"
                        : "border-gray-200 bg-white hover:border-gray-400"
                    }`}
                  >
                    <h3 className="font-bold text-gray-900">
                      {reserva.propiedad}
                    </h3>

                    <p className="mt-2 text-sm text-gray-600">
                      Reserva #{reserva.id}
                    </p>

                    <p className="mt-1 text-sm text-gray-600">
                      Finalizó el{" "}
                      {formatearFecha(
                        reserva.fechaFin
                      )}
                    </p>
                  </button>
                ))
              )}
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow">
            <h2 className="text-2xl font-bold text-gray-900">
              Escribir reseña
            </h2>

            {reservaSeleccionada === null ? (
              <div className="mt-6 rounded-2xl bg-gray-100 p-5 text-gray-600">
                Seleccioná una estadía para escribir una reseña.
              </div>
            ) : (
              <form
                onSubmit={crearResena}
                className="mt-6 space-y-6"
              >
                <div>
                  <p className="font-semibold text-gray-900">
                    Puntaje
                  </p>

                  <div className="mt-3 flex gap-2">
                    {[1, 2, 3, 4, 5].map(
                      (valor) => (
                        <button
                          key={valor}
                          type="button"
                          onClick={() =>
                            setPuntaje(valor)
                          }
                          aria-label={`Dar ${valor} de 5`}
                          className={`text-4xl ${
                            valor <= puntaje
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        >
                          ★
                        </button>
                      )
                    )}
                  </div>

                  <p className="mt-2 text-sm text-gray-600">
                    {puntaje === 0
                      ? "Seleccioná un puntaje de 1 a 5."
                      : `${puntaje} de 5`}
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="comentario"
                    className="mb-2 block font-semibold text-gray-900"
                  >
                    Comentario
                  </label>

                  <textarea
                    id="comentario"
                    value={comentario}
                    onChange={(event) =>
                      setComentario(
                        event.target.value
                      )
                    }
                    placeholder="Contanos cómo fue tu estadía..."
                    rows={5}
                    className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-500 outline-none focus:border-rose-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-rose-500 px-6 py-3 font-semibold text-white hover:bg-rose-600"
                >
                  Publicar reseña
                </button>
              </form>
            )}
          </section>
        </div>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-gray-900">
            Reseñas de mis propiedades visitadas
          </h2>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {Array.from(
              new Set(
                resenas.map(
                  (resena) => resena.propiedadId
                )
              )
            ).map((propiedadId) => {
              const resenasPropiedad =
                obtenerResenasPropiedad(
                  propiedadId
                );

              const reserva =
                reservas.find(
                  (item) =>
                    item.propiedadId ===
                    propiedadId
                );

              return (
                <article
                  key={propiedadId}
                  className="rounded-3xl bg-white p-6 shadow"
                >
                  <h3 className="text-xl font-bold text-gray-900">
                    {reserva?.propiedad ??
                      `Propiedad #${propiedadId}`}
                  </h3>

                  <div className="mt-4 space-y-4">
                    {resenasPropiedad.map(
                      (resena) => (
                        <div
                          key={resena.id}
                          className="border-b border-gray-200 pb-4 last:border-b-0"
                        >
                          <div className="flex items-center gap-1">
                            {Array.from({
                              length: 5,
                            }).map(
                              (_, indice) => (
                                <span
                                  key={indice}
                                  className={
                                    indice <
                                    resena.puntaje
                                      ? "text-yellow-400"
                                      : "text-gray-300"
                                  }
                                >
                                  ★
                                </span>
                              )
                            )}
                          </div>

                          {resena.comentario && (
                            <p className="mt-2 text-gray-700">
                              {resena.comentario}
                            </p>
                          )}

                          <p className="mt-2 text-sm text-gray-500">
                            {formatearFecha(
                              resena.fecha
                            )}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </section>
    </main>
  );
}