"use client";

import { FormEvent, useState } from "react";
import { api, errorMessage } from "../../lib/api";

type Propiedad = {
  id: number;
  titulo: string;
  direccion: string;
  ciudad: string;
  precio_noche: number;
  capacidad: number;
  reservas: {
    fecha_inicio: string;
    fecha_fin: string;
    estado: string;
  }[];
};


export default function BuscarPage() {
  const [ciudad, setCiudad] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [huespedes, setHuespedes] = useState("");
  const [precioMax, setPrecioMax] = useState("");

  const [resultados, setResultados] = useState<Propiedad[]>(
    []
  );

  const [busquedaRealizada, setBusquedaRealizada] =
    useState(false);

  const [error, setError] = useState("");

  async function buscarPropiedades(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setBusquedaRealizada(false);

    if (!ciudad.trim()) {
      setError("Ingresá una ciudad.");
      return;
    }

    if (!fechaDesde) {
      setError("Seleccioná la fecha de inicio.");
      return;
    }

    if (!fechaHasta) {
      setError("Seleccioná la fecha de fin.");
      return;
    }

    if (fechaDesde >= fechaHasta) {
      setError(
        "La fecha de inicio debe ser anterior a la fecha de fin."
      );
      return;
    }

    const cantidadHuespedes = Number(huespedes);

    if (!huespedes || cantidadHuespedes <= 0) {
      setError("La cantidad de huéspedes debe ser mayor a 0.");
      return;
    }

    let precioMaximo: number | null = null;

    if (precioMax.trim() !== "") {
      precioMaximo = Number(precioMax);

      if (precioMaximo <= 0) {
        setError("El precio máximo debe ser mayor a 0.");
        return;
      }
    }

    try {
      const params = new URLSearchParams({ ciudad: ciudad.trim(), desde: fechaDesde, hasta: fechaHasta, huespedes: String(cantidadHuespedes) });
      if (precioMaximo !== null) params.set("precio_max", String(precioMaximo));
      const propiedades = await api<Propiedad[]>(`/propiedades?${params}`);
      setResultados(propiedades);
      setBusquedaRealizada(true);
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

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            Buscar propiedades
          </h1>

          <p className="mt-2 text-gray-600">
            Buscá alojamientos por ciudad, fechas, huéspedes y
            precio.
          </p>
        </div>

        <div className="mt-8 rounded-3xl bg-white p-6 shadow">
          <form
            onSubmit={buscarPropiedades}
            className="grid gap-5 md:grid-cols-2 lg:grid-cols-5"
          >
            <div>
              <label
                htmlFor="ciudad"
                className="mb-2 block font-semibold text-gray-900"
              >
                Ciudad
              </label>

              <input
                id="ciudad"
                type="text"
                value={ciudad}
                onChange={(event) =>
                  setCiudad(event.target.value)
                }
                placeholder="Ej: Buenos Aires"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-500 outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label
                htmlFor="desde"
                className="mb-2 block font-semibold text-gray-900"
              >
                Desde
              </label>

              <input
                id="desde"
                type="date"
                value={fechaDesde}
                onChange={(event) =>
                  setFechaDesde(event.target.value)
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label
                htmlFor="hasta"
                className="mb-2 block font-semibold text-gray-900"
              >
                Hasta
              </label>

              <input
                id="hasta"
                type="date"
                value={fechaHasta}
                onChange={(event) =>
                  setFechaHasta(event.target.value)
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label
                htmlFor="huespedes"
                className="mb-2 block font-semibold text-gray-900"
              >
                Huéspedes
              </label>

              <input
                id="huespedes"
                type="number"
                min="1"
                value={huespedes}
                onChange={(event) =>
                  setHuespedes(event.target.value)
                }
                placeholder="Ej: 2"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-500 outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label
                htmlFor="precioMax"
                className="mb-2 block font-semibold text-gray-900"
              >
                Precio máximo
              </label>

              <input
                id="precioMax"
                type="number"
                min="1"
                step="0.01"
                value={precioMax}
                onChange={(event) =>
                  setPrecioMax(event.target.value)
                }
                placeholder="Opcional"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-500 outline-none focus:border-rose-500"
              />
            </div>

            <div className="md:col-span-2 lg:col-span-5">
              {error && (
                <div className="mb-5 rounded-xl bg-red-100 p-4 font-medium text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded-xl bg-rose-500 px-6 py-3 font-semibold text-white hover:bg-rose-600"
              >
                Buscar propiedades
              </button>
            </div>
          </form>
        </div>

        {busquedaRealizada && (
          <section className="mt-10">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Resultados
              </h2>

              <span className="text-gray-600">
                {resultados.length}{" "}
                {resultados.length === 1
                  ? "propiedad encontrada"
                  : "propiedades encontradas"}
              </span>
            </div>

            {resultados.length === 0 ? (
              <div className="mt-6 rounded-3xl bg-white p-8 text-center shadow">
                <h3 className="text-xl font-bold text-gray-900">
                  No encontramos propiedades
                </h3>

                <p className="mt-2 text-gray-600">
                  Probá cambiar la ciudad, las fechas, la cantidad
                  de huéspedes o el precio máximo.
                </p>
              </div>
            ) : (
              <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {resultados.map((propiedad) => (
                  <article
                    key={propiedad.id}
                    className="overflow-hidden rounded-3xl bg-white shadow"
                  >
                    <div className="flex h-40 items-center justify-center bg-gray-200">
                      <span className="text-5xl">🏠</span>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900">
                        {propiedad.titulo}
                      </h3>

                      <p className="mt-2 text-gray-600">
                        {propiedad.direccion}
                      </p>

                      <p className="text-gray-600">
                        {propiedad.ciudad}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800">
                          Hasta {propiedad.capacidad} huéspedes
                        </span>

                        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800">
                          Disponible
                        </span>
                      </div>

                      <p className="mt-5 text-lg font-bold text-gray-900">
                        ${propiedad.precio_noche.toLocaleString(
                          "es-AR"
                        )}{" "}
                        <span className="font-normal text-gray-600">
                          por noche
                        </span>
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}
      </section>
    </main>
  );
}
