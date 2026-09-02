"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { api, errorMessage } from "../lib/api";
import { Navbar } from "../components/navbar";
import { useAuth } from "../components/auth-provider";

type Propiedad = {
  id: number;
  titulo: string;
  direccion: string;
  ciudad: string;
  precio_noche: number;
  capacidad: number;
  imagen_url?: string | null;
};

const PLACEHOLDER = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85";

function imagenSegura(url: string | null | undefined) {
  return url && /^https?:\/\//i.test(url) ? url : PLACEHOLDER;
}

export default function Home() {
  const { usuario } = useAuth();
  const [ciudad, setCiudad] = useState("");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [huespedes, setHuespedes] = useState(1);
  const [propiedades, setPropiedades] = useState<Propiedad[]>([]);
  const [cargando, setCargando] = useState(true);
  const [buscando, setBuscando] = useState(false);
  const [error, setError] = useState("");
  const [favoritos, setFavoritos] = useState<number[]>([]);
  const [actualizandoFavorito, setActualizandoFavorito] = useState<number | null>(null);

  async function cargarPropiedades(query = "") {
    try {
      setError("");
      setPropiedades(await api<Propiedad[]>(`/propiedades${query}`));
    } catch (cause) {
      setError(errorMessage(cause));
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void cargarPropiedades().finally(() => setCargando(false));
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!usuario) { setFavoritos([]); return; }
      void api<Propiedad[]>("/favoritos")
        .then((lista) => setFavoritos(lista.map((propiedad) => propiedad.id)))
        .catch(() => setFavoritos([]));
    }, 0);
    return () => window.clearTimeout(timer);
  }, [usuario]);

  async function alternarFavorito(propiedadId: number) {
    if (!usuario) {
      setError("Debés iniciar sesión para guardar favoritos.");
      return;
    }
    const yaEsFavorito = favoritos.includes(propiedadId);
    setActualizandoFavorito(propiedadId);
    setError("");
    try {
      await api(`/favoritos/${propiedadId}`, { method: yaEsFavorito ? "DELETE" : "POST" });
      setFavoritos((actuales) => yaEsFavorito ? actuales.filter((id) => id !== propiedadId) : [...actuales, propiedadId]);
    } catch (cause) {
      setError(errorMessage(cause));
    } finally {
      setActualizandoFavorito(null);
    }
  }

  async function buscarPropiedades(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (desde && hasta && hasta <= desde) {
      setError("La fecha de salida debe ser posterior a la fecha de entrada.");
      return;
    }
    if (huespedes < 1) {
      setError("La cantidad de huéspedes debe ser mayor a 0.");
      return;
    }
    const params = new URLSearchParams({ huespedes: String(huespedes) });
    if (ciudad.trim()) params.set("ciudad", ciudad.trim());
    if (desde) params.set("desde", desde);
    if (hasta) params.set("hasta", hasta);
    setBuscando(true);
    await cargarPropiedades(`?${params.toString()}`);
    setBuscando(false);
    document.getElementById("alojamientos")?.scrollIntoView({ behavior: "smooth" });
  }

  return <main className="min-h-screen bg-white text-gray-900">
    <Navbar />

    <section className="bg-gray-100 px-6 py-16"><div className="mx-auto max-w-5xl text-center">
      <h1 className="text-5xl font-bold tracking-tight">Encontrá tu próximo alojamiento</h1>
      <p className="mt-4 text-lg text-gray-600">Buscá propiedades, reservá tu estadía y disfrutá del viaje.</p>
      <form onSubmit={buscarPropiedades} className="mt-10 rounded-3xl bg-white p-4 shadow-lg">
        <div className="grid gap-4 md:grid-cols-4">
          <Campo etiqueta="Ciudad"><input type="text" placeholder="¿A dónde vas?" value={ciudad} onChange={(e) => setCiudad(e.target.value)} className="campo" /></Campo>
          <Campo etiqueta="Desde"><input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} className="campo" /></Campo>
          <Campo etiqueta="Hasta"><input type="date" min={desde || undefined} value={hasta} onChange={(e) => setHasta(e.target.value)} className="campo" /></Campo>
          <Campo etiqueta="Huéspedes"><input type="number" min="1" value={huespedes} onChange={(e) => setHuespedes(Number(e.target.value))} className="campo" /></Campo>
        </div>
        {error && <p className="mt-4 rounded-xl bg-red-100 p-3 text-left text-sm font-medium text-red-700" role="alert">{error}</p>}
        <button type="submit" disabled={buscando} className="mt-5 w-full rounded-xl bg-rose-500 px-6 py-4 font-semibold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:bg-rose-300">{buscando ? "Buscando…" : "Buscar propiedades"}</button>
      </form>
    </div></section>

    <section id="alojamientos" className="mx-auto max-w-7xl px-6 py-14">
      <h2 className="text-3xl font-bold">Explorá alojamientos</h2>
      <p className="mt-2 text-gray-600">Propiedades disponibles según tus criterios de búsqueda.</p>
      {cargando ? <p className="mt-8 text-slate-900" role="status">Cargando alojamientos…</p> : propiedades.length === 0 ? <p className="mt-8 rounded-xl bg-gray-100 p-5 text-slate-800">No encontramos alojamientos disponibles con esos filtros.</p> : <div className="mt-8 grid gap-6 md:grid-cols-3">{propiedades.map((p) => { const esFavorito = favoritos.includes(p.id); return <article key={p.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="relative"><img src={imagenSegura(p.imagen_url)} alt={`Alojamiento: ${p.titulo}`} className="h-48 w-full object-cover" onError={(e) => { e.currentTarget.src = PLACEHOLDER; }} /><button type="button" aria-label={esFavorito ? "Quitar de favoritos" : "Agregar a favoritos"} aria-pressed={esFavorito} disabled={actualizandoFavorito === p.id} onClick={() => void alternarFavorito(p.id)} className={`absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-white text-xl shadow transition hover:scale-105 disabled:opacity-60 ${esFavorito ? "text-rose-600" : "text-slate-900"}`}>{esFavorito ? "♥" : "♡"}</button></div><div className="p-5"><h3 className="text-xl font-semibold text-slate-950">{p.titulo}</h3><p className="mt-1 text-slate-700">{p.ciudad} · {p.capacidad} huéspedes</p><p className="mt-2 text-slate-700">{p.direccion}</p><p className="mt-4 font-semibold text-slate-950">${Number(p.precio_noche).toLocaleString("es-AR")} por noche</p><div className="mt-4 flex gap-4"><Link className="font-semibold text-rose-700 hover:underline" href={`/propiedades/${p.id}`}>Ver detalle</Link><Link className="font-semibold text-rose-700 hover:underline" href="/reservar">Reservar</Link></div></div></article>; })}</div>}
    </section>
    <footer className="border-t bg-gray-50 px-6 py-8"><div className="mx-auto max-w-7xl text-center text-sm text-gray-500">Airbnb - Proyecto de Taller de Programación</div></footer>
  </main>;
}

function Campo({ etiqueta, children }: { etiqueta: string; children: React.ReactNode }) {
  return <div className="text-left"><label className="mb-2 block text-sm font-semibold">{etiqueta}</label>{children}</div>;
}
