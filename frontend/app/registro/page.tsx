"use client";

import { FormEvent, useState } from "react";

type Usuario = {
  id: number;
  email: string;
  nombre: string;
  fecha_registro: string;
  es_anfitrion: boolean;
};

export default function RegistroPage() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [esAnfitrion, setEsAnfitrion] = useState(false);

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const [usuario, setUsuario] = useState<Usuario | null>(null);

  function registrarUsuario(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMensaje("");
    setError("");

    if (!nombre.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }

    if (!email.trim()) {
      setError("El email es obligatorio.");
      return;
    }

    if (!email.includes("@")) {
      setError("Ingresá un email válido.");
      return;
    }

    const nuevoUsuario: Usuario = {
      id: Date.now(),
      email: email.trim(),
      nombre: nombre.trim(),
      fecha_registro: new Date().toISOString(),
      es_anfitrion: esAnfitrion,
    };

    setUsuario(nuevoUsuario);

    setMensaje("Usuario preparado para registrarse correctamente.");
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

      <section className="mx-auto max-w-xl px-6 py-12">
        <div className="rounded-3xl bg-white p-8 shadow">
          <h1 className="text-3xl font-bold text-gray-900">
            Crear una cuenta
          </h1>

          <p className="mt-2 text-gray-600">
            Registrate para reservar alojamientos o publicar tus
            propiedades.
          </p>

          <form
            onSubmit={registrarUsuario}
            className="mt-8 space-y-5"
          >
            <div>
              <label
                htmlFor="nombre"
                className="mb-2 block font-semibold text-gray-900"
              >
                Nombre
              </label>

              <input
                id="nombre"
                type="text"
                value={nombre}
                onChange={(event) =>
                  setNombre(event.target.value)
                }
                placeholder="Ingresá tu nombre"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-500 outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block font-semibold text-gray-900"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="ejemplo@email.com"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-500 outline-none focus:border-rose-500"
              />
            </div>

            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 p-4">
              <input
                type="checkbox"
                checked={esAnfitrion}
                onChange={(event) =>
                  setEsAnfitrion(event.target.checked)
                }
                className="mt-1 h-4 w-4"
              />

              <span>
                <span className="block font-semibold text-gray-900">
                  Quiero publicar propiedades
                </span>

                <span className="mt-1 block text-sm text-gray-600">
                  Registrarme como anfitrión.
                </span>
              </span>
            </label>

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
              className="w-full rounded-xl bg-rose-500 px-6 py-3 font-semibold text-white hover:bg-rose-600"
            >
              Registrarme
            </button>
          </form>

          {usuario && (
            <div className="mt-8 rounded-2xl bg-gray-100 p-5">
              <h2 className="font-bold text-gray-900">
                Usuario preparado para registrarse
              </h2>

              <div className="mt-3 space-y-2 text-sm text-gray-700">
                <p>
                  <strong>Nombre:</strong> {usuario.nombre}
                </p>

                <p>
                  <strong>Email:</strong> {usuario.email}
                </p>

                <p>
                  <strong>Anfitrión:</strong>{" "}
                  {usuario.es_anfitrion ? "Sí" : "No"}
                </p>

                <p>
                  <strong>Fecha de registro:</strong>{" "}
                  {new Date(
                    usuario.fecha_registro
                  ).toLocaleString("es-AR")}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}