"use client";

import { useState } from "react";

export default function Resena() {
  const [puntaje, setPuntaje] = useState("");
  const [comentario, setComentario] = useState("");
  const [mensaje, setMensaje] = useState("");

  function publicarResena(e: React.FormEvent) {
    e.preventDefault();

    if (!puntaje || !comentario) {
      setMensaje("Completá el puntaje y el comentario.");
      return;
    }

    const numeroPuntaje = Number(puntaje);

    if (numeroPuntaje < 1 || numeroPuntaje > 5) {
      setMensaje("El puntaje debe estar entre 1 y 5.");
      return;
    }

    setMensaje(
      `Reseña preparada correctamente. Puntaje: ${numeroPuntaje}/5. Comentario: ${comentario}`
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
        <div className="w-full max-w-2xl rounded-3xl bg-white p-8 shadow-lg">
          <h1 className="text-3xl font-bold text-gray-900">
            Dejar una reseña
          </h1>

          <p className="mt-2 text-gray-600">
            Contanos cómo fue tu experiencia en esta propiedad.
          </p>

          <div className="mt-8 rounded-2xl border p-6">
            <p className="font-semibold text-gray-900">
              Propiedad
            </p>

            <p className="mt-1 text-gray-600">
              Casa en Palermo
            </p>

            <p className="mt-4 font-semibold text-gray-900">
              Estadía
            </p>

            <p className="mt-1 text-gray-600">
              10/09/2026 - 15/09/2026
            </p>

            <p className="mt-4 text-sm text-green-600">
              Estadía finalizada
            </p>
          </div>

          <form
            onSubmit={publicarResena}
            className="mt-8 space-y-6"
          >
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">
                Puntaje
              </label>

              <select
                value={puntaje}
                onChange={(e) => setPuntaje(e.target.value)}
                className="w-full rounded-xl border px-4 py-3 text-gray-900 outline-none focus:border-rose-500"
              >
                <option value="">Seleccioná un puntaje</option>
                <option value="1">1 - Muy malo</option>
                <option value="2">2 - Malo</option>
                <option value="3">3 - Regular</option>
                <option value="4">4 - Bueno</option>
                <option value="5">5 - Excelente</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">
                Comentario
              </label>

              <textarea
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="Escribí tu experiencia..."
                rows={5}
                className="w-full rounded-xl border px-4 py-3 text-gray-900 placeholder:text-gray-500 outline-none focus:border-rose-500"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-rose-500 px-6 py-4 font-semibold text-white hover:bg-rose-600"
            >
              Publicar reseña
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