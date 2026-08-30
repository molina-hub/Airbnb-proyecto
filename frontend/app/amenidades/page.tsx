"use client";

import { useState } from "react";

type Amenidad = {
  id: number;
  nombre: string;
};

type Propiedad = {
  id: number;
  titulo: string;
  ciudad: string;
  precioNoche: number;
  amenidades: number[];
};

const amenidadesDisponibles: Amenidad[] = [
  {
    id: 1,
    nombre: "wifi",
  },
  {
    id: 2,
    nombre: "pileta",
  },
  {
    id: 3,
    nombre: "estacionamiento",
  },
  {
    id: 4,
    nombre: "aire acondicionado",
  },
  {
    id: 5,
    nombre: "calefacción",
  },
  {
    id: 6,
    nombre: "cocina",
  },
  {
    id: 7,
    nombre: "lavarropas",
  },
  {
    id: 8,
    nombre: "balcón",
  },
];

const propiedadesIniciales: Propiedad[] = [
  {
    id: 1,
    titulo: "Departamento moderno",
    ciudad: "Buenos Aires",
    precioNoche: 50000,
    amenidades: [1, 3, 4, 6, 7],
  },
  {
    id: 2,
    titulo: "Casa familiar",
    ciudad: "Buenos Aires",
    precioNoche: 75000,
    amenidades: [1, 2, 3, 5, 6, 7],
  },
  {
    id: 3,
    titulo: "Casa con pileta",
    ciudad: "Córdoba",
    precioNoche: 60000,
    amenidades: [1, 2, 3, 4, 6, 8],
  },
  {
    id: 4,
    titulo: "Cabaña de montaña",
    ciudad: "Bariloche",
    precioNoche: 90000,
    amenidades: [1, 3, 5, 6, 8],
  },
];

export default function AmenidadesPage() {
  const [propiedades, setPropiedades] =
    useState<Propiedad[]>(
      propiedadesIniciales
    );

  const [propiedadSeleccionada, setPropiedadSeleccionada] =
    useState<number>(1);

  const [amenidadesSeleccionadas, setAmenidadesSeleccionadas] =
    useState<number[]>(
      propiedadesIniciales[0].amenidades
    );

  const [filtroAmenidades, setFiltroAmenidades] =
    useState<number[]>([]);

  const [mensaje, setMensaje] = useState("");

  const propiedadActual = propiedades.find(
    (propiedad) =>
      propiedad.id === propiedadSeleccionada
  );

  function cambiarPropiedad(
    propiedadId: number
  ) {
    setPropiedadSeleccionada(propiedadId);

    const propiedad = propiedades.find(
      (item) => item.id === propiedadId
    );

    setAmenidadesSeleccionadas(
      propiedad?.amenidades ?? []
    );

    setMensaje("");
  }

  function alternarAmenidad(
    amenidadId: number
  ) {
    setAmenidadesSeleccionadas(
      (amenidadesActuales) => {
        if (
          amenidadesActuales.includes(
            amenidadId
          )
        ) {
          return amenidadesActuales.filter(
            (id) => id !== amenidadId
          );
        }

        return [
          ...amenidadesActuales,
          amenidadId,
        ];
      }
    );
  }

  function guardarAmenidades() {
    if (!propiedadActual) {
      return;
    }

    setPropiedades(
      (propiedadesActuales) =>
        propiedadesActuales.map(
          (propiedad) =>
            propiedad.id ===
            propiedadSeleccionada
              ? {
                  ...propiedad,
                  amenidades:
                    amenidadesSeleccionadas,
                }
              : propiedad
        )
    );

    setMensaje(
      "Las amenidades fueron guardadas correctamente."
    );
  }

  function alternarFiltro(
    amenidadId: number
  ) {
    setFiltroAmenidades(
      (filtrosActuales) => {
        if (
          filtrosActuales.includes(
            amenidadId
          )
        ) {
          return filtrosActuales.filter(
            (id) => id !== amenidadId
          );
        }

        return [
          ...filtrosActuales,
          amenidadId,
        ];
      }
    );
  }

  const propiedadesFiltradas =
    propiedades.filter((propiedad) => {
      return filtroAmenidades.every(
        (amenidadId) =>
          propiedad.amenidades.includes(
            amenidadId
          )
      );
    });

  function nombreAmenidad(
    amenidadId: number
  ) {
    return (
      amenidadesDisponibles.find(
        (amenidad) =>
          amenidad.id === amenidadId
      )?.nombre ?? ""
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
          Amenidades
        </h1>

        <p className="mt-2 text-gray-600">
          Administrá las comodidades de tus propiedades
          y filtrá alojamientos según sus servicios.
        </p>

        {mensaje && (
          <div className="mt-6 rounded-xl bg-green-100 p-4 font-medium text-green-700">
            {mensaje}
          </div>
        )}

        <section className="mt-10 rounded-3xl bg-white p-8 shadow">
          <h2 className="text-2xl font-bold text-gray-900">
            Amenidades de una propiedad
          </h2>

          <div className="mt-6">
            <label
              htmlFor="propiedad"
              className="mb-2 block font-semibold text-gray-900"
            >
              Seleccionar propiedad
            </label>

            <select
              id="propiedad"
              value={propiedadSeleccionada}
              onChange={(event) =>
                cambiarPropiedad(
                  Number(event.target.value)
                )
              }
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-rose-500"
            >
              {propiedades.map(
                (propiedad) => (
                  <option
                    key={propiedad.id}
                    value={propiedad.id}
                  >
                    {propiedad.titulo} -{" "}
                    {propiedad.ciudad}
                  </option>
                )
              )}
            </select>
          </div>

          <div className="mt-6">
            <p className="font-semibold text-gray-900">
              Seleccioná las amenidades
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {amenidadesDisponibles.map(
                (amenidad) => {
                  const seleccionada =
                    amenidadesSeleccionadas.includes(
                      amenidad.id
                    );

                  return (
                    <label
                      key={amenidad.id}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 ${
                        seleccionada
                          ? "border-rose-500 bg-rose-50"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={seleccionada}
                        onChange={() =>
                          alternarAmenidad(
                            amenidad.id
                          )
                        }
                        className="h-5 w-5 accent-rose-500"
                      />

                      <span className="font-medium text-gray-900">
                        {amenidad.nombre}
                      </span>
                    </label>
                  );
                }
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={guardarAmenidades}
            className="mt-6 rounded-xl bg-rose-500 px-6 py-3 font-semibold text-white hover:bg-rose-600"
          >
            Guardar amenidades
          </button>
        </section>

        <section className="mt-10 rounded-3xl bg-white p-8 shadow">
          <h2 className="text-2xl font-bold text-gray-900">
            Buscar por amenidades
          </h2>

          <p className="mt-2 text-gray-600">
            Seleccioná una o más. Las propiedades deben tener
            todas las amenidades seleccionadas.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
            {amenidadesDisponibles.map(
              (amenidad) => {
                const seleccionada =
                  filtroAmenidades.includes(
                    amenidad.id
                  );

                return (
                  <button
                    key={amenidad.id}
                    type="button"
                    onClick={() =>
                      alternarFiltro(
                        amenidad.id
                      )
                    }
                    className={`rounded-xl border px-4 py-3 text-left font-medium ${
                      seleccionada
                        ? "border-rose-500 bg-rose-50 text-rose-700"
                        : "border-gray-300 bg-white text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    {seleccionada
                      ? "✓ "
                      : ""}
                    {amenidad.nombre}
                  </button>
                );
              }
            )}
          </div>

          {filtroAmenidades.length > 0 && (
            <div className="mt-6 rounded-2xl bg-gray-100 p-5">
              <p className="font-semibold text-gray-900">
                Filtros seleccionados:
              </p>

              <div className="mt-2 flex flex-wrap gap-2">
                {filtroAmenidades.map(
                  (amenidadId) => (
                    <span
                      key={amenidadId}
                      className="rounded-full bg-white px-3 py-1 text-sm font-medium text-gray-800"
                    >
                      {nombreAmenidad(
                        amenidadId
                      )}
                    </span>
                  )
                )}
              </div>
            </div>
          )}
        </section>

        <section className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Propiedades encontradas
            </h2>

            <span className="rounded-full bg-white px-4 py-2 font-semibold text-gray-700 shadow">
              {propiedadesFiltradas.length}{" "}
              resultados
            </span>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {propiedadesFiltradas.length === 0 ? (
              <div className="rounded-3xl bg-white p-8 text-gray-600 shadow md:col-span-2">
                No hay propiedades que tengan todas las
                amenidades seleccionadas.
              </div>
            ) : (
              propiedadesFiltradas.map(
                (propiedad) => (
                  <article
                    key={propiedad.id}
                    className="rounded-3xl bg-white p-6 shadow"
                  >
                    <h3 className="text-xl font-bold text-gray-900">
                      {propiedad.titulo}
                    </h3>

                    <p className="mt-1 text-gray-600">
                      {propiedad.ciudad}
                    </p>

                    <p className="mt-3 text-lg font-bold text-gray-900">
                      $
                      {propiedad.precioNoche.toLocaleString(
                        "es-AR"
                      )}{" "}
                      <span className="text-sm font-normal text-gray-500">
                        por noche
                      </span>
                    </p>

                    <div className="mt-5">
                      <p className="mb-2 font-semibold text-gray-900">
                        Amenidades:
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {propiedad.amenidades.map(
                          (amenidadId) => (
                            <span
                              key={amenidadId}
                              className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
                            >
                              {nombreAmenidad(
                                amenidadId
                              )}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </article>
                )
              )
            )}
          </div>
        </section>
      </section>
    </main>
  );
}