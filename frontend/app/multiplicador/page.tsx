"use client";

import { useState } from "react";

type Multiplicador = {
  id: number;
  dia: string;
  horaDesde: string;
  horaHasta: string;
  factor: number;
};

const multiplicadoresIniciales: Multiplicador[] = [
  {
    id: 1,
    dia: "Viernes",
    horaDesde: "18:00",
    horaHasta: "23:00",
    factor: 1.5,
  },
  {
    id: 2,
    dia: "Sábado",
    horaDesde: "12:00",
    horaHasta: "23:00",
    factor: 1.8,
  },
];

export default function Multiplicador() {
  const [multiplicadores, setMultiplicadores] = useState<
    Multiplicador[]
  >(multiplicadoresIniciales);

  const [dia, setDia] = useState("");
  const [horaDesde, setHoraDesde] = useState("");
  const [horaHasta, setHoraHasta] = useState("");
  const [factor, setFactor] = useState("");

  const [mensaje, setMensaje] = useState("");

  function agregarMultiplicador(e: React.FormEvent) {
    e.preventDefault();

    if (!dia || !horaDesde || !horaHasta || !factor) {
      setMensaje("Completá todos los campos.");
      return;
    }

    if (horaDesde >= horaHasta) {
      setMensaje(
        "La hora desde debe ser anterior a la hora hasta."
      );
      return;
    }

    const numeroFactor = Number(factor);

    if (numeroFactor <= 1) {
      setMensaje("El factor debe ser mayor que 1.");
      return;
    }

    const nuevoMultiplicador: Multiplicador = {
      id: Date.now(),
      dia,
      horaDesde,
      horaHasta,
      factor: numeroFactor,
    };

    setMultiplicadores([
      ...multiplicadores,
      nuevoMultiplicador,
    ]);

    setDia("");
    setHoraDesde("");
    setHoraHasta("");
    setFactor("");

    setMensaje("Multiplicador agregado correctamente.");
  }

  function eliminarMultiplicador(id: number) {
    setMultiplicadores(
      multiplicadores.filter(
        (multiplicador) => multiplicador.id !== id
      )
    );

    setMensaje("Multiplicador eliminado correctamente.");
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

      <section className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-900">
          Multiplicadores horarios
        </h1>

        <p className="mt-2 text-gray-600">
          Configurá factores de precio para horarios de mayor
          demanda.
        </p>

        {mensaje && (
          <div className="mt-6 rounded-xl bg-white p-4 text-gray-900 shadow">
            {mensaje}
          </div>
        )}

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl bg-white p-8 shadow">
            <h2 className="text-2xl font-bold text-gray-900">
              Agregar multiplicador
            </h2>

            <form
              onSubmit={agregarMultiplicador}
              className="mt-6 space-y-5"
            >
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Día
                </label>

                <select
                  value={dia}
                  onChange={(e) => setDia(e.target.value)}
                  className="w-full rounded-xl border px-4 py-3 text-gray-900 outline-none focus:border-rose-500"
                >
                  <option value="">Seleccioná un día</option>
                  <option value="Domingo">Domingo</option>
                  <option value="Lunes">Lunes</option>
                  <option value="Martes">Martes</option>
                  <option value="Miércoles">Miércoles</option>
                  <option value="Jueves">Jueves</option>
                  <option value="Viernes">Viernes</option>
                  <option value="Sábado">Sábado</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Hora desde
                </label>

                <input
                  type="time"
                  value={horaDesde}
                  onChange={(e) =>
                    setHoraDesde(e.target.value)
                  }
                  className="w-full rounded-xl border px-4 py-3 text-gray-900 outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Hora hasta
                </label>

                <input
                  type="time"
                  value={horaHasta}
                  onChange={(e) =>
                    setHoraHasta(e.target.value)
                  }
                  className="w-full rounded-xl border px-4 py-3 text-gray-900 outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Factor
                </label>

                <input
                  type="number"
                  min="1.01"
                  step="0.01"
                  value={factor}
                  onChange={(e) => setFactor(e.target.value)}
                  placeholder="Ej: 1.5"
                  className="w-full rounded-xl border px-4 py-3 text-gray-900 placeholder:text-gray-500 outline-none focus:border-rose-500"
                />

                <p className="mt-2 text-sm text-gray-500">
                  Ejemplo: 1.5 significa un aumento del 50%.
                </p>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-rose-500 px-6 py-3 font-semibold text-white hover:bg-rose-600"
              >
                Agregar multiplicador
              </button>
            </form>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow">
            <h2 className="text-2xl font-bold text-gray-900">
              Multiplicadores configurados
            </h2>

            <div className="mt-6 space-y-4">
              {multiplicadores.map((multiplicador) => (
                <div
                  key={multiplicador.id}
                  className="rounded-2xl border p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {multiplicador.dia}
                      </h3>

                      <p className="mt-1 text-gray-600">
                        {multiplicador.horaDesde} -{" "}
                        {multiplicador.horaHasta}
                      </p>
                    </div>

                    <span className="rounded-full bg-rose-100 px-4 py-2 font-bold text-rose-600">
                      x{multiplicador.factor}
                    </span>
                  </div>

                  <p className="mt-4 text-sm text-gray-600">
                    Aumento aplicado:{" "}
                    {Math.round(
                      (multiplicador.factor - 1) * 100
                    )}
                    %
                  </p>

                  <button
                    onClick={() =>
                      eliminarMultiplicador(multiplicador.id)
                    }
                    className="mt-4 rounded-xl bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}