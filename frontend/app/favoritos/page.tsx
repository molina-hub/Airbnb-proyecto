"use client";

import { useState } from "react";

type Propiedad = {
  id: number;
  titulo: string;
  ciudad: string;
  precio: number;
};

const propiedadesIniciales: Propiedad[] = [
  {
    id: 1,
    titulo: "Casa con pileta",
    ciudad: "Buenos Aires",
    precio: 50000,
  },
  {
    id: 2,
    titulo: "Departamento moderno",
    ciudad: "Córdoba",
    precio: 40000,
  },
  {
    id: 3,
    titulo: "Casa cerca del centro",
    ciudad: "Mendoza",
    precio: 60000,
  },
];

export default function Favoritos() {
  const [favoritos, setFavoritos] = useState<number[]>([]);
  const [mensaje, setMensaje] = useState("");

  function cambiarFavorito(id: number) {
    if (favoritos.includes(id)) {
      setFavoritos(favoritos.filter((favorito) => favorito !== id));
      setMensaje("La propiedad fue eliminada de favoritos.");
    } else {
      setFavoritos([...favoritos, id]);
      setMensaje("La propiedad fue agregada a favoritos.");
    }
  }

  const propiedadesFavoritas = propiedadesIniciales.filter((propiedad) =>
    favoritos.includes(propiedad.id)
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
        <h1 className="text-4xl font-bold text-gray-900">
          Propiedades favoritas
        </h1>

        <p className="mt-2 text-gray-600">
          Guardá las propiedades que más te interesen para encontrarlas
          fácilmente.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {propiedadesIniciales.map((propiedad) => {
            const esFavorita = favoritos.includes(propiedad.id);

            return (
              <div
                key={propiedad.id}
                className="rounded-2xl bg-white p-6 shadow"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {propiedad.titulo}
                    </h2>

                    <p className="mt-2 text-gray-600">
                      {propiedad.ciudad}
                    </p>
                  </div>

                  <button
                    onClick={() => cambiarFavorito(propiedad.id)}
                    aria-label={
                      esFavorita
                        ? "Quitar de favoritos"
                        : "Agregar a favoritos"
                    }
                    className={`flex h-12 w-12 items-center justify-center rounded-full border-2 text-3xl font-bold shadow-sm transition ${
                      esFavorita
                        ? "border-rose-500 bg-rose-500 text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:border-rose-500 hover:text-rose-500"
                    }`}
                  >
                    {esFavorita ? "♥" : "♡"}
                  </button>
                </div>

                <p className="mt-6 font-semibold text-gray-900">
                  ${propiedad.precio} por noche
                </p>

                <button
                  onClick={() => cambiarFavorito(propiedad.id)}
                  className="mt-5 w-full rounded-xl border border-rose-500 px-4 py-3 font-semibold text-rose-500 hover:bg-rose-50"
                >
                  {esFavorita
                    ? "Quitar de favoritos"
                    : "Agregar a favoritos"}
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-12 rounded-3xl bg-white p-8 shadow">
          <h2 className="text-2xl font-bold text-gray-900">
            Mis favoritos
          </h2>

          {propiedadesFavoritas.length === 0 ? (
            <p className="mt-4 text-gray-600">
              Todavía no tenés propiedades favoritas.
            </p>
          ) : (
            <div className="mt-6 space-y-4">
              {propiedadesFavoritas.map((propiedad) => (
                <div
                  key={propiedad.id}
                  className="flex items-center justify-between rounded-xl border p-4"
                >
                  <div>
                    <p className="font-semibold text-gray-900">
                      {propiedad.titulo}
                    </p>

                    <p className="text-sm text-gray-600">
                      {propiedad.ciudad}
                    </p>
                  </div>

                  <span className="font-semibold text-gray-900">
                    ${propiedad.precio}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {mensaje && (
          <div className="mt-6 rounded-xl bg-white p-4 text-gray-900 shadow">
            {mensaje}
          </div>
        )}
      </section>
    </main>
  );
}