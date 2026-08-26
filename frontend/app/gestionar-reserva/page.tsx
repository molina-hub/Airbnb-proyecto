"use client";

import { useState } from "react";

type EstadoReserva = "pendiente" | "confirmada" | "rechazada" | "cancelada";

export default function GestionarReserva() {
  const [estado, setEstado] = useState<EstadoReserva>("pendiente");
  const [mensaje, setMensaje] = useState("");

  function cambiarEstado(nuevoEstado: EstadoReserva) {
    if (estado === "pendiente" && nuevoEstado === "confirmada") {
      setEstado("confirmada");
      setMensaje("La reserva fue confirmada correctamente.");
      return;
    }

    if (estado === "pendiente" && nuevoEstado === "rechazada") {
      setEstado("rechazada");
      setMensaje("La reserva fue rechazada.");
      return;
    }

    if (estado === "confirmada" && nuevoEstado === "cancelada") {
      setEstado("cancelada");
      setMensaje("La reserva fue cancelada.");
      return;
    }

    setMensaje(
      `No se puede cambiar de ${estado} a ${nuevoEstado}.`
    );
  }

  function cancelarReserva() {
    if (estado !== "confirmada") {
      setMensaje(
        "Solo se puede cancelar una reserva que esté confirmada."
      );
      return;
    }

    setEstado("cancelada");
    setMensaje(
      "La reserva fue cancelada. La penalización se calculará en el backend según la anticipación."
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
            Gestionar reserva
          </h1>

          <p className="mt-2 text-gray-600">
            El anfitrión puede aceptar, rechazar o cancelar una reserva.
          </p>

          <div className="mt-8 rounded-2xl border p-6">
            <div className="space-y-3 text-gray-900">
              <p>
                <strong>Propiedad:</strong> Casa en Palermo
              </p>

              <p>
                <strong>Huésped:</strong> Juan Molina
              </p>

              <p>
                <strong>Fecha de inicio:</strong> 10/09/2026
              </p>

              <p>
                <strong>Fecha de fin:</strong> 15/09/2026
              </p>

              <p>
                <strong>Total:</strong> $250000
              </p>
            </div>

            <div className="mt-6 border-t pt-6">
              <p className="text-sm font-semibold text-gray-600">
                Estado actual
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {estado}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <button
              onClick={() => cambiarEstado("confirmada")}
              disabled={estado !== "pendiente"}
              className="rounded-xl bg-green-600 px-6 py-4 font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              Confirmar reserva
            </button>

            <button
              onClick={() => cambiarEstado("rechazada")}
              disabled={estado !== "pendiente"}
              className="rounded-xl bg-red-600 px-6 py-4 font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              Rechazar reserva
            </button>

            <button
              onClick={cancelarReserva}
              disabled={estado !== "confirmada"}
              className="rounded-xl bg-orange-500 px-6 py-4 font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-300 md:col-span-2"
            >
              Cancelar reserva
            </button>
          </div>

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