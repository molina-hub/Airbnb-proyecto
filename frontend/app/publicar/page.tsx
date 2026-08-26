"use client";

import { FormEvent, useState } from "react";

type Propiedad = {
  id: number;
  titulo: string;
  direccion: string;
  ciudad: string;
  precio_noche: number;
  capacidad: number;
  anfitrion_id: number;
};

export default function PublicarPage() {
  const [esAnfitrion, setEsAnfitrion] = useState(true);

  const [titulo, setTitulo] = useState("");
  const [direccion, setDireccion] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [precioNoche, setPrecioNoche] = useState("");
  const [capacidad, setCapacidad] = useState("");

  const [propiedades, setPropiedades] = useState<Propiedad[]>([]);

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  function publicarPropiedad(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMensaje("");
    setError("");

    if (!esAnfitrion) {
      setError(
        "Solo un usuario registrado como anfitrión puede publicar propiedades."
      );
      return;
    }

    if (!titulo.trim()) {
      setError("El título es obligatorio.");
      return;
    }

    if (!direccion.trim()) {
      setError("La dirección es obligatoria.");
      return;
    }

    if (!ciudad.trim()) {
      setError("La ciudad es obligatoria.");
      return;
    }

    const precio = Number(precioNoche);
    const cantidadPersonas = Number(capacidad);

    if (!precioNoche || precio <= 0) {
      setError("El precio por noche debe ser mayor a 0.");
      return;
    }

    if (!capacidad || cantidadPersonas <= 0) {
      setError("La capacidad debe ser mayor a 0.");
      return;
    }

    const nuevaPropiedad: Propiedad = {
      id: Date.now(),
      titulo: titulo.trim(),
      direccion: direccion.trim(),
      ciudad: ciudad.trim(),
      precio_noche: precio,
      capacidad: cantidadPersonas,
      anfitrion_id: 1,
    };

    setPropiedades((propiedadesActuales) => [
      ...propiedadesActuales,
      nuevaPropiedad,
    ]);

    setTitulo("");
    setDireccion("");
    setCiudad("");
    setPrecioNoche("");
    setCapacidad("");

    setMensaje("La propiedad fue preparada correctamente para publicarse.");
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
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold text-gray-900">
            Publicar una propiedad
          </h1>

          <p className="mt-2 text-gray-600">
            Completá los datos de tu propiedad para recibir reservas.
          </p>

          <div className="mt-8 rounded-3xl bg-white p-8 shadow">
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
              <p className="font-semibold text-gray-900">
                Tipo de usuario
              </p>

              <label className="mt-4 flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={esAnfitrion}
                  onChange={(event) => {
                    setEsAnfitrion(event.target.checked);
                    setError("");
                    setMensaje("");
                  }}
                  className="h-5 w-5"
                />

                <span className="font-medium text-gray-900">
                  Soy anfitrión
                </span>
              </label>

              {!esAnfitrion && (
                <p className="mt-3 text-sm font-medium text-red-600">
                  Debés ser anfitrión para poder publicar una propiedad.
                </p>
              )}
            </div>

            <form
              onSubmit={publicarPropiedad}
              className="mt-8 space-y-6"
            >
              <div>
                <label
                  htmlFor="titulo"
                  className="mb-2 block font-semibold text-gray-900"
                >
                  Título
                </label>

                <input
                  id="titulo"
                  type="text"
                  value={titulo}
                  onChange={(event) =>
                    setTitulo(event.target.value)
                  }
                  placeholder="Ej: Departamento moderno con balcón"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-500 outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label
                  htmlFor="direccion"
                  className="mb-2 block font-semibold text-gray-900"
                >
                  Dirección
                </label>

                <input
                  id="direccion"
                  type="text"
                  value={direccion}
                  onChange={(event) =>
                    setDireccion(event.target.value)
                  }
                  placeholder="Ej: Av. Corrientes 1234"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-500 outline-none focus:border-rose-500"
                />
              </div>

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

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="precio"
                    className="mb-2 block font-semibold text-gray-900"
                  >
                    Precio por noche
                  </label>

                  <input
                    id="precio"
                    type="number"
                    min="1"
                    step="0.01"
                    value={precioNoche}
                    onChange={(event) =>
                      setPrecioNoche(event.target.value)
                    }
                    placeholder="Ej: 50000"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-500 outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="capacidad"
                    className="mb-2 block font-semibold text-gray-900"
                  >
                    Capacidad
                  </label>

                  <input
                    id="capacidad"
                    type="number"
                    min="1"
                    step="1"
                    value={capacidad}
                    onChange={(event) =>
                      setCapacidad(event.target.value)
                    }
                    placeholder="Ej: 4"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-500 outline-none focus:border-rose-500"
                  />
                </div>
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
                disabled={!esAnfitrion}
                className="w-full rounded-xl bg-rose-500 px-6 py-3 font-semibold text-white hover:bg-rose-600 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                Publicar propiedad
              </button>
            </form>
          </div>
        </div>

        {propiedades.length > 0 && (
          <div className="mx-auto mt-10 max-w-5xl">
            <h2 className="text-2xl font-bold text-gray-900">
              Mis propiedades
            </h2>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              {propiedades.map((propiedad) => (
                <article
                  key={propiedad.id}
                  className="rounded-3xl bg-white p-6 shadow"
                >
                  <h3 className="text-xl font-bold text-gray-900">
                    {propiedad.titulo}
                  </h3>

                  <p className="mt-2 text-gray-600">
                    {propiedad.direccion}
                  </p>

                  <p className="text-gray-600">
                    {propiedad.ciudad}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800">
                      ${propiedad.precio_noche} por noche
                    </span>

                    <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800">
                      Hasta {propiedad.capacidad} huéspedes
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}