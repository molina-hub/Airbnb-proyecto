"use client";

import { useState } from "react";

export default function Registro() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [esAnfitrion, setEsAnfitrion] = useState(false);
  const [mensaje, setMensaje] = useState("");

  function registrarse(e: React.FormEvent) {
    e.preventDefault();

    if (!nombre || !email) {
      setMensaje("Completá todos los campos obligatorios.");
      return;
    }

    setMensaje(
      `Usuario preparado para registrarse: ${nombre} - ${email} - ${
        esAnfitrion ? "Anfitrión" : "Huésped"
      }`
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
            className="text-sm font-medium text-gray-900 hover:text-rose-500"
          >
            Volver al inicio
          </a>
        </div>
      </header>

      <section className="flex justify-center px-6 py-12">
        <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-lg">
          <h1 className="text-3xl font-bold text-gray-900">
            Crear una cuenta
          </h1>

          <p className="mt-2 text-gray-600">
            Registrate para reservar alojamientos o publicar tus propiedades.
          </p>

          <form
            onSubmit={registrarse}
            className="mt-8 space-y-5"
          >
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">
                Nombre
              </label>

              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ingresá tu nombre"
                className="w-full rounded-xl border px-4 py-3 text-gray-900 placeholder:text-gray-500 outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@gmail.com"
                className="w-full rounded-xl border px-4 py-3 text-gray-900 placeholder:text-gray-500 outline-none focus:border-rose-500"
              />
            </div>

            <div className="rounded-xl border p-4">
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={esAnfitrion}
                  onChange={(e) => setEsAnfitrion(e.target.checked)}
                  className="h-5 w-5"
                />

                <div>
                  <p className="font-semibold text-gray-900">
                    Quiero publicar propiedades
                  </p>

                  <p className="text-sm text-gray-600">
                    Registrarme como anfitrión.
                  </p>
                </div>
              </label>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-rose-500 px-6 py-4 font-semibold text-white hover:bg-rose-600"
            >
              Registrarme
            </button>
          </form>

          {mensaje && (
            <div className="mt-6 rounded-xl bg-gray-100 p-4 text-sm text-gray-900">
              {mensaje}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}