"use client";

import { useState } from "react";

type Propiedad = {
  id: number;
  titulo: string;
  ciudad: string;
  disponible: boolean;
};

const propiedadesIniciales: Propiedad[] = [
  {
    id: 1,
    titulo: "Casa con pileta",
    ciudad: "Buenos Aires",
    disponible: true,
  },
  {
    id: 2,
    titulo: "Departamento moderno",
    ciudad: "Córdoba",
    disponible: false,
  },
  {
    id: 3,
    titulo: "Casa cerca del centro",
    ciudad: "Mendoza",
    disponible: true,
  },
];

export default function Disponibilidad() {
  const [propiedades, setPropiedades] = useState<Propiedad[]>(
    propiedadesIniciales
  );

  const [mensaje, setMensaje] = useState("");

  function cambiarDisponibilidad(id: number) {
    setPropiedades(
      propiedades.map((propiedad) =>
        propiedad.id === id
          ? {
              ...propiedad,
              disponible: !propiedad.disponible,
            }
          : propiedad
      )
    );

    const propiedad = propiedades.find(
      (propiedad) => propiedad.id === id
    );

    if (propiedad) {
      setMensaje(
        propiedad.disponible
          ? `${propiedad.titulo} ahora no está disponible.`
          : `${propiedad.titulo} ahora está disponible.`
      );
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
            className="text-sm font-medium text-gray-900 hover:text-rose-500"
          >
            Volver al inicio
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-900">
          Disponibilidad de mis propiedades
        </h1>

        <p className="mt-2 text-gray-600">
          Indicá qué propiedades están disponibles para recibir
          reservas.
        </p>

        {mensaje && (
          <div className="mt-6 rounded-xl bg-white p-4 text-gray-900 shadow">
            {mensaje}
          </div>
        )}

        <div className="mt-10 space-y-5">
          {propiedades.map((propiedad) => (
            <div
              key={propiedad.id}
              className="flex flex-col justify-between gap-6 rounded-3xl bg-white p-6 shadow md:flex-row md:items-center"
            >
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {propiedad.titulo}
                </h2>

                <p className="mt-1 text-gray-600">
                  {propiedad.ciudad}
                </p>

                <div className="mt-4">
                  {propiedad.disponible ? (
                    <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-700">
                      Disponible
                    </span>
                  ) : (
                    <span className="rounded-full bg-red-100 px-4 py-2 text-sm font-bold text-red-700">
                      No disponible
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => cambiarDisponibilidad(propiedad.id)}
                className={`rounded-xl px-6 py-3 font-semibold text-white ${
                  propiedad.disponible
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {propiedad.disponible
                  ? "Marcar no disponible"
                  : "Marcar disponible"}
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}