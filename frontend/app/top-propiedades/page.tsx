"use client";

import { useMemo, useState } from "react";

type Resena = {
  id: number;
  propiedadId: number;
  autor: string;
  puntaje: number;
  comentario: string;
  fecha: string;
};

type Propiedad = {
  id: number;
  titulo: string;
  ciudad: string;
  precioNoche: number;
};

const propiedades: Propiedad[] = [
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
  {
    id: 5,
    titulo: "Loft céntrico",
    ciudad: "Buenos Aires",
    precioNoche: 55000,
  },
  {
    id: 6,
    titulo: "Casa frente al lago",
    ciudad: "Bariloche",
    precioNoche: 110000,
  },
];

const resenas: Resena[] = [
  {
    id: 1,
    propiedadId: 1,
    autor: "Ana",
    puntaje: 5,
    comentario: "Excelente propiedad.",
    fecha: "2026-07-10",
  },
  {
    id: 2,
    propiedadId: 1,
    autor: "Pedro",
    puntaje: 4,
    comentario: "Muy cómoda y bien ubicada.",
    fecha: "2026-07-15",
  },
  {
    id: 3,
    propiedadId: 1,
    autor: "Lucía",
    puntaje: 5,
    comentario: "Todo estuvo perfecto.",
    fecha: "2026-07-20",
  },
  {
    id: 4,
    propiedadId: 1,
    autor: "Martín",
    puntaje: 5,
    comentario: "Muy recomendable.",
    fecha: "2026-07-25",
  },
  {
    id: 5,
    propiedadId: 2,
    autor: "Sofía",
    puntaje: 4,
    comentario: "Muy linda casa.",
    fecha: "2026-07-12",
  },
  {
    id: 6,
    propiedadId: 2,
    autor: "Juan",
    puntaje: 4,
    comentario: "Buena experiencia.",
    fecha: "2026-07-18",
  },
  {
    id: 7,
    propiedadId: 2,
    autor: "Carlos",
    puntaje: 5,
    comentario: "Excelente atención.",
    fecha: "2026-07-22",
  },
  {
    id: 8,
    propiedadId: 3,
    autor: "María",
    puntaje: 5,
    comentario: "La pileta es excelente.",
    fecha: "2026-07-05",
  },
  {
    id: 9,
    propiedadId: 3,
    autor: "Diego",
    puntaje: 5,
    comentario: "Muy recomendable.",
    fecha: "2026-07-11",
  },
  {
    id: 10,
    propiedadId: 3,
    autor: "Laura",
    puntaje: 4,
    comentario: "Muy buena estadía.",
    fecha: "2026-07-19",
  },
  {
    id: 11,
    propiedadId: 4,
    autor: "Federico",
    puntaje: 5,
    comentario: "Lugar increíble.",
    fecha: "2026-07-08",
  },
  {
    id: 12,
    propiedadId: 4,
    autor: "Carolina",
    puntaje: 5,
    comentario: "Hermosas vistas.",
    fecha: "2026-07-14",
  },
  {
    id: 13,
    propiedadId: 4,
    autor: "Nicolás",
    puntaje: 5,
    comentario: "Todo excelente.",
    fecha: "2026-07-21",
  },
  {
    id: 14,
    propiedadId: 5,
    autor: "Valentina",
    puntaje: 4,
    comentario: "Muy buena ubicación.",
    fecha: "2026-07-09",
  },
  {
    id: 15,
    propiedadId: 5,
    autor: "Tomás",
    puntaje: 3,
    comentario: "Está bien.",
    fecha: "2026-07-16",
  },
  {
    id: 16,
    propiedadId: 5,
    autor: "Micaela",
    puntaje: 4,
    comentario: "Cómodo y práctico.",
    fecha: "2026-07-24",
  },
  {
    id: 17,
    propiedadId: 6,
    autor: "Gabriel",
    puntaje: 5,
    comentario: "Vista espectacular.",
    fecha: "2026-07-06",
  },
  {
    id: 18,
    propiedadId: 6,
    autor: "Camila",
    puntaje: 4,
    comentario: "Muy lindo lugar.",
    fecha: "2026-07-13",
  },
  {
    id: 19,
    propiedadId: 6,
    autor: "Agustín",
    puntaje: 5,
    comentario: "Volvería sin dudas.",
    fecha: "2026-07-23",
  },
];

const ciudades = [
  "Todas",
  ...Array.from(
    new Set(
      propiedades.map(
        (propiedad) => propiedad.ciudad
      )
    )
  ),
];

function calcularPromedio(
  propiedadId: number
) {
  const resenasPropiedad = resenas.filter(
    (resena) =>
      resena.propiedadId === propiedadId
  );

  if (resenasPropiedad.length === 0) {
    return 0;
  }

  const suma = resenasPropiedad.reduce(
    (total, resena) =>
      total + resena.puntaje,
    0
  );

  return suma / resenasPropiedad.length;
}

function formatearDinero(valor: number) {
  return valor.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });
}

export default function TopPropiedadesPage() {
  const [ciudad, setCiudad] =
    useState("Todas");

  const [busquedaRealizada, setBusquedaRealizada] =
    useState(true);

  const topPropiedades = useMemo(() => {
    const propiedadesConResenas =
      propiedades
        .map((propiedad) => {
          const resenasPropiedad =
            resenas.filter(
              (resena) =>
                resena.propiedadId ===
                propiedad.id
            );

          const promedio =
            calcularPromedio(
              propiedad.id
            );

          return {
            ...propiedad,
            resenas: resenasPropiedad,
            cantidadResenas:
              resenasPropiedad.length,
            promedio,
          };
        })
        .filter(
          (propiedad) =>
            propiedad.cantidadResenas >= 3
        )
        .filter(
          (propiedad) =>
            ciudad === "Todas" ||
            propiedad.ciudad === ciudad
        )
        .sort(
          (a, b) =>
            b.promedio - a.promedio
        )
        .slice(0, 10);

    return propiedadesConResenas;
  }, [ciudad]);

  function buscar() {
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
            Top propiedades por ciudad
          </h1>

          <p className="mt-2 text-gray-600">
            Encontrá las propiedades mejor calificadas
            de cada ciudad.
          </p>
        </div>

        <section className="mt-8 rounded-3xl bg-white p-8 shadow">
          <h2 className="text-2xl font-bold text-gray-900">
            Buscar propiedades
          </h2>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label
                htmlFor="ciudad"
                className="mb-2 block font-semibold text-gray-900"
              >
                Ciudad
              </label>

              <select
                id="ciudad"
                value={ciudad}
                onChange={(event) => {
                  setCiudad(
                    event.target.value
                  );
                  setBusquedaRealizada(
                    false
                  );
                }}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-rose-500"
              >
                {ciudades.map(
                  (nombreCiudad) => (
                    <option
                      key={nombreCiudad}
                      value={nombreCiudad}
                    >
                      {nombreCiudad}
                    </option>
                  )
                )}
              </select>
            </div>

            <button
              type="button"
              onClick={buscar}
              className="rounded-xl bg-rose-500 px-7 py-3 font-semibold text-white hover:bg-rose-600"
            >
              Buscar
            </button>
          </div>
        </section>

        {busquedaRealizada && (
          <section className="mt-8">
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {ciudad === "Todas"
                    ? "Mejores propiedades"
                    : `Mejores propiedades de ${ciudad}`}
                </h2>

                <p className="text-gray-600">
                  Se consideran únicamente propiedades
                  con al menos 3 reseñas.
                </p>
              </div>

              <span className="rounded-full bg-white px-4 py-2 font-semibold text-gray-700 shadow">
                {topPropiedades.length} resultados
              </span>
            </div>

            {topPropiedades.length === 0 ? (
              <div className="rounded-3xl bg-white p-10 text-center shadow">
                <div className="text-5xl">★</div>

                <h3 className="mt-4 text-2xl font-bold text-gray-900">
                  No hay propiedades disponibles
                </h3>

                <p className="mt-2 text-gray-600">
                  No encontramos propiedades con al menos
                  3 reseñas para esta ciudad.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {topPropiedades.map(
                  (propiedad, indice) => (
                    <article
                      key={propiedad.id}
                      className="rounded-3xl bg-white p-6 shadow"
                    >
                      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xl font-bold text-gray-900">
                          #{indice + 1}
                        </div>

                        <div className="flex-1">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <h3 className="text-2xl font-bold text-gray-900">
                                {propiedad.titulo}
                              </h3>

                              <p className="mt-1 text-gray-600">
                                {propiedad.ciudad}
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-2xl text-yellow-500">
                                ★
                              </span>

                              <span className="text-2xl font-bold text-gray-900">
                                {propiedad.promedio.toFixed(
                                  1
                                )}
                              </span>

                              <span className="text-gray-500">
                                / 5
                              </span>
                            </div>
                          </div>

                          <div className="mt-5 grid gap-4 sm:grid-cols-3">
                            <div className="rounded-xl bg-gray-100 p-4">
                              <p className="text-sm text-gray-500">
                                Reseñas
                              </p>

                              <p className="mt-1 text-lg font-bold text-gray-900">
                                {
                                  propiedad.cantidadResenas
                                }
                              </p>
                            </div>

                            <div className="rounded-xl bg-gray-100 p-4">
                              <p className="text-sm text-gray-500">
                                Promedio
                              </p>

                              <p className="mt-1 text-lg font-bold text-gray-900">
                                {propiedad.promedio.toFixed(
                                  2
                                )}
                              </p>
                            </div>

                            <div className="rounded-xl bg-gray-100 p-4">
                              <p className="text-sm text-gray-500">
                                Precio por noche
                              </p>

                              <p className="mt-1 text-lg font-bold text-gray-900">
                                {formatearDinero(
                                  propiedad.precioNoche
                                )}
                              </p>
                            </div>
                          </div>

                          <div className="mt-5">
                            <p className="font-semibold text-gray-900">
                              Últimas reseñas
                            </p>

                            <div className="mt-3 space-y-2">
                              {propiedad.resenas
                                .slice(-3)
                                .map(
                                  (resena) => (
                                    <div
                                      key={
                                        resena.id
                                      }
                                      className="rounded-xl border border-gray-200 p-3"
                                    >
                                      <div className="flex items-center justify-between">
                                        <span className="font-semibold text-gray-900">
                                          {
                                            resena.autor
                                          }
                                        </span>

                                        <span className="font-semibold text-gray-900">
                                          ★{" "}
                                          {
                                            resena.puntaje
                                          }
                                          /5
                                        </span>
                                      </div>

                                      <p className="mt-1 text-sm text-gray-600">
                                        {
                                          resena.comentario
                                        }
                                      </p>
                                    </div>
                                  )
                                )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  )
                )}
              </div>
            )}
          </section>
        )}
      </section>
    </main>
  );
}