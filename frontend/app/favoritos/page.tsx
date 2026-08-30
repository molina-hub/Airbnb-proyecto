"use client";

import { useState } from "react";

type Propiedad = {
  id: number;
  titulo: string;
  ciudad: string;
  direccion: string;
  precioNoche: number;
  capacidad: number;
  anfitrion: string;
};

const propiedadesIniciales: Propiedad[] = [
  {
    id: 1,
    titulo: "Departamento moderno",
    ciudad: "Buenos Aires",
    direccion: "Palermo",
    precioNoche: 50000,
    capacidad: 4,
    anfitrion: "Carlos",
  },
  {
    id: 2,
    titulo: "Casa familiar",
    ciudad: "Buenos Aires",
    direccion: "Belgrano",
    precioNoche: 75000,
    capacidad: 6,
    anfitrion: "María",
  },
  {
    id: 3,
    titulo: "Casa con pileta",
    ciudad: "Córdoba",
    direccion: "Villa Carlos Paz",
    precioNoche: 60000,
    capacidad: 5,
    anfitrion: "Pedro",
  },
  {
    id: 4,
    titulo: "Cabaña de montaña",
    ciudad: "Bariloche",
    direccion: "Cerro Catedral",
    precioNoche: 90000,
    capacidad: 4,
    anfitrion: "Lucía",
  },
];

const favoritosIniciales = [1, 3];

const usuarioActual = {
  id: 20,
  nombre: "Juan",
};

export default function FavoritosPage() {
  const [favoritos, setFavoritos] = useState<number[]>(
    favoritosIniciales
  );

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const propiedadesFavoritas =
    propiedadesIniciales.filter((propiedad) =>
      favoritos.includes(propiedad.id)
    );

  function agregarFavorito(propiedadId: number) {
    setMensaje("");
    setError("");

    if (favoritos.includes(propiedadId)) {
      setError(
        "Esta propiedad ya está en favoritos."
      );
      return;
    }

    setFavoritos((favoritosActuales) => [
      ...favoritosActuales,
      propiedadId,
    ]);

    setMensaje(
      "La propiedad fue agregada a favoritos."
    );
  }

  function quitarFavorito(propiedadId: number) {
    setMensaje("");
    setError("");

    if (!favoritos.includes(propiedadId)) {
      setError(
        "Esta propiedad no está en favoritos."
      );
      return;
    }

    setFavoritos((favoritosActuales) =>
      favoritosActuales.filter(
        (id) => id !== propiedadId
      )
    );

    setMensaje(
      "La propiedad fue quitada de favoritos."
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

          <div className="flex items-center gap-6">
            <span className="font-medium text-gray-700">
              Hola, {usuarioActual.nombre}
            </span>

            <a
              href="/"
              className="font-medium text-gray-900 hover:text-rose-500"
            >
              Inicio
            </a>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            Mis favoritos
          </h1>

          <p className="mt-2 text-gray-600">
            Guardá las propiedades que más te interesan.
          </p>
        </div>

        {mensaje && (
          <div className="mt-6 rounded-xl bg-green-100 p-4 font-medium text-green-700">
            {mensaje}
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-xl bg-red-100 p-4 font-medium text-red-700">
            {error}
          </div>
        )}

        <section className="mt-10">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Propiedades favoritas
            </h2>

            <span className="rounded-full bg-white px-4 py-2 font-semibold text-gray-700 shadow">
              {propiedadesFavoritas.length}{" "}
              {propiedadesFavoritas.length === 1
                ? "favorito"
                : "favoritos"}
            </span>
          </div>

          {propiedadesFavoritas.length === 0 ? (
            <div className="rounded-3xl bg-white p-10 text-center shadow">
              <div className="text-6xl">♡</div>

              <h3 className="mt-4 text-2xl font-bold text-gray-900">
                Todavía no tenés favoritos
              </h3>

              <p className="mt-2 text-gray-600">
                Agregá propiedades a favoritos para encontrarlas
                fácilmente después.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {propiedadesFavoritas.map(
                (propiedad) => (
                  <article
                    key={propiedad.id}
                    className="overflow-hidden rounded-3xl bg-white shadow"
                  >
                    <div className="flex h-44 items-center justify-center bg-gray-200">
                      <span className="text-6xl">
                        🏠
                      </span>
                    </div>

                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">
                            {propiedad.titulo}
                          </h3>

                          <p className="mt-1 text-gray-600">
                            {propiedad.ciudad}
                          </p>

                          <p className="text-sm text-gray-500">
                            {propiedad.direccion}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            quitarFavorito(
                              propiedad.id
                            )
                          }
                          aria-label={`Quitar ${propiedad.titulo} de favoritos`}
                          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-3xl text-rose-500 shadow-sm hover:bg-rose-50"
                        >
                          ♥
                        </button>
                      </div>

                      <div className="mt-5 flex items-end justify-between border-t pt-5">
                        <div>
                          <p className="text-sm text-gray-500">
                            Precio por noche
                          </p>

                          <p className="text-xl font-bold text-gray-900">
                            $
                            {propiedad.precioNoche.toLocaleString(
                              "es-AR"
                            )}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-gray-500">
                            Capacidad
                          </p>

                          <p className="font-semibold text-gray-900">
                            {propiedad.capacidad} huéspedes
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          quitarFavorito(
                            propiedad.id
                          )
                        }
                        className="mt-5 w-full rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-900 hover:bg-gray-100"
                      >
                        Quitar de favoritos
                      </button>
                    </div>
                  </article>
                )
              )}
            </div>
          )}
        </section>

        <section className="mt-12 rounded-3xl bg-white p-8 shadow">
          <h2 className="text-2xl font-bold text-gray-900">
            Todas las propiedades
          </h2>

          <p className="mt-2 text-gray-600">
            Podés agregar cualquier propiedad a tus favoritos.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {propiedadesIniciales.map(
              (propiedad) => {
                const esFavorito =
                  favoritos.includes(
                    propiedad.id
                  );

                return (
                  <div
                    key={propiedad.id}
                    className="flex items-center justify-between rounded-2xl border border-gray-200 p-5"
                  >
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {propiedad.titulo}
                      </h3>

                      <p className="text-sm text-gray-600">
                        {propiedad.ciudad}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        esFavorito
                          ? quitarFavorito(
                              propiedad.id
                            )
                          : agregarFavorito(
                              propiedad.id
                            )
                      }
                      aria-label={
                        esFavorito
                          ? `Quitar ${propiedad.titulo} de favoritos`
                          : `Agregar ${propiedad.titulo} a favoritos`
                      }
                      className={`flex h-12 w-12 items-center justify-center rounded-full border text-3xl ${
                        esFavorito
                          ? "border-rose-200 bg-rose-50 text-rose-500"
                          : "border-gray-300 bg-white text-gray-400 hover:text-rose-500"
                      }`}
                    >
                      {esFavorito ? "♥" : "♡"}
                    </button>
                  </div>
                );
              }
            )}
          </div>
        </section>
      </section>
    </main>
  );
}