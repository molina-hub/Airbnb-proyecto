"use client";

import { useState } from "react";

type Cargo = {
  id: number;
  reserva: string;
  propiedad: string;
  motivo: string;
  monto: number;
  fecha: string;
};

const cargosIniciales: Cargo[] = [
  {
    id: 1,
    reserva: "Reserva #1001",
    propiedad: "Casa con pileta",
    motivo: "Penalidad por cancelación tardía",
    monto: 25000,
    fecha: "20/08/2026",
  },
];

export default function Cargos() {
  const [cargos, setCargos] = useState<Cargo[]>(
    cargosIniciales
  );

  const [reserva, setReserva] = useState("");
  const [propiedad, setPropiedad] = useState("");
  const [motivo, setMotivo] = useState("");
  const [monto, setMonto] = useState("");

  const [mensaje, setMensaje] = useState("");

  function agregarCargo(e: React.FormEvent) {
    e.preventDefault();

    if (!reserva || !propiedad || !motivo || !monto) {
      setMensaje("Completá todos los campos.");
      return;
    }

    const montoNumerico = Number(monto);

    if (montoNumerico <= 0) {
      setMensaje("El monto debe ser mayor a 0.");
      return;
    }

    const nuevoCargo: Cargo = {
      id: Date.now(),
      reserva,
      propiedad,
      motivo,
      monto: montoNumerico,
      fecha: new Date().toLocaleDateString("es-AR"),
    };

    setCargos([...cargos, nuevoCargo]);

    setReserva("");
    setPropiedad("");
    setMotivo("");
    setMonto("");

    setMensaje("Cargo registrado correctamente.");
  }

  function eliminarCargo(id: number) {
    const confirmar = window.confirm(
      "¿Seguro que querés eliminar este cargo?"
    );

    if (!confirmar) {
      return;
    }

    setCargos(
      cargos.filter((cargo) => cargo.id !== id)
    );

    setMensaje("Cargo eliminado correctamente.");
  }

  const totalCargos = cargos.reduce(
    (total, cargo) => total + cargo.monto,
    0
  );

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
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            Cargos y penalidades
          </h1>

          <p className="mt-2 text-gray-600">
            Registrá y consultá los cargos asociados a las
            reservas.
          </p>
        </div>

        {mensaje && (
          <div className="mt-6 rounded-xl bg-white p-4 text-gray-900 shadow">
            {mensaje}
          </div>
        )}

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl bg-white p-8 shadow">
            <h2 className="text-2xl font-bold text-gray-900">
              Registrar cargo
            </h2>

            <form
              onSubmit={agregarCargo}
              className="mt-6 space-y-5"
            >
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Reserva
                </label>

                <input
                  type="text"
                  value={reserva}
                  onChange={(e) =>
                    setReserva(e.target.value)
                  }
                  placeholder="Ej: Reserva #1002"
                  className="w-full rounded-xl border px-4 py-3 text-gray-900 placeholder:text-gray-500 outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Propiedad
                </label>

                <input
                  type="text"
                  value={propiedad}
                  onChange={(e) =>
                    setPropiedad(e.target.value)
                  }
                  placeholder="Ej: Departamento moderno"
                  className="w-full rounded-xl border px-4 py-3 text-gray-900 placeholder:text-gray-500 outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Motivo
                </label>

                <select
                  value={motivo}
                  onChange={(e) =>
                    setMotivo(e.target.value)
                  }
                  className="w-full rounded-xl border px-4 py-3 text-gray-900 outline-none focus:border-rose-500"
                >
                  <option value="">
                    Seleccioná un motivo
                  </option>

                  <option value="Penalidad por cancelación tardía">
                    Penalidad por cancelación tardía
                  </option>

                  <option value="Daños en la propiedad">
                    Daños en la propiedad
                  </option>

                  <option value="Cargo adicional">
                    Cargo adicional
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Monto
                </label>

                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={monto}
                  onChange={(e) =>
                    setMonto(e.target.value)
                  }
                  placeholder="Ej: 25000"
                  className="w-full rounded-xl border px-4 py-3 text-gray-900 placeholder:text-gray-500 outline-none focus:border-rose-500"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-rose-500 px-6 py-3 font-semibold text-white hover:bg-rose-600"
              >
                Registrar cargo
              </button>
            </form>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Cargos registrados
              </h2>

              <div className="rounded-xl bg-gray-100 px-4 py-3">
                <p className="text-xs text-gray-500">
                  Total
                </p>

                <p className="font-bold text-gray-900">
                  ${totalCargos}
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {cargos.length === 0 ? (
                <p className="text-gray-600">
                  No hay cargos registrados.
                </p>
              ) : (
                cargos.map((cargo) => (
                  <div
                    key={cargo.id}
                    className="rounded-2xl border p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-gray-900">
                          {cargo.reserva}
                        </h3>

                        <p className="mt-1 text-gray-600">
                          {cargo.propiedad}
                        </p>
                      </div>

                      <p className="font-bold text-red-600">
                        ${cargo.monto}
                      </p>
                    </div>

                    <div className="mt-4 space-y-1 text-sm text-gray-600">
                      <p>
                        <strong>Motivo:</strong>{" "}
                        {cargo.motivo}
                      </p>

                      <p>
                        <strong>Fecha:</strong>{" "}
                        {cargo.fecha}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        eliminarCargo(cargo.id)
                      }
                      className="mt-4 rounded-xl bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
                    >
                      Eliminar
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}