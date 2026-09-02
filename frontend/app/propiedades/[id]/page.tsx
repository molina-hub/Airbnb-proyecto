"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Navbar } from "../../../components/navbar";
import { useAuth } from "../../../components/auth-provider";
import { api, errorMessage } from "../../../lib/api";

type Propiedad = { id: number; titulo: string; ciudad: string; direccion: string; descripcion?: string | null; imagen_url?: string | null; precio_noche: number; capacidad: number; amenidades: { id: number; nombre: string }[] };
const IMAGEN_PREDETERMINADA = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85";

export default function DetallePropiedadPage() {
  const params = useParams<{ id: string }>();
  const { usuario } = useAuth();
  const [propiedad, setPropiedad] = useState<Propiedad | null>(null);
  const [esFavorito, setEsFavorito] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const id = Number(params.id);
    const timer = window.setTimeout(() => {
      if (!Number.isInteger(id) || id <= 0) { setError("El alojamiento solicitado no es válido."); setCargando(false); return; }
      void api<Propiedad>(`/propiedades/${id}`).then(setPropiedad).catch((cause) => setError(errorMessage(cause))).finally(() => setCargando(false));
    }, 0);
    return () => window.clearTimeout(timer);
  }, [params.id]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!usuario || !propiedad) { setEsFavorito(false); return; }
      void api<Propiedad[]>("/favoritos").then((lista) => setEsFavorito(lista.some((item) => item.id === propiedad.id))).catch(() => setEsFavorito(false));
    }, 0);
    return () => window.clearTimeout(timer);
  }, [usuario, propiedad]);

  async function alternarFavorito() {
    if (!usuario) { setError("Debés iniciar sesión para guardar favoritos."); return; }
    if (!propiedad) return;
    try {
      await api(`/favoritos/${propiedad.id}`, { method: esFavorito ? "DELETE" : "POST" });
      setEsFavorito((actual) => !actual);
    } catch (cause) { setError(errorMessage(cause)); }
  }

  return <main className="min-h-screen bg-slate-50 text-slate-950"><Navbar /><section className="mx-auto max-w-5xl px-6 py-12">{cargando ? <p role="status" className="text-slate-900">Cargando alojamiento…</p> : error ? <p role="alert" className="rounded-xl bg-amber-50 p-4 font-medium text-amber-900">{error}</p> : propiedad && <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl"><img src={propiedad.imagen_url || IMAGEN_PREDETERMINADA} onError={(event) => { event.currentTarget.src = IMAGEN_PREDETERMINADA; }} alt={propiedad.titulo} className="h-80 w-full object-cover" /><div className="p-8"><div className="flex flex-wrap items-start justify-between gap-5"><div><h1 className="text-4xl font-bold text-slate-950">{propiedad.titulo}</h1><p className="mt-2 text-lg text-slate-800">{propiedad.ciudad} · {propiedad.direccion}</p></div><button onClick={() => void alternarFavorito()} className="rounded-full border border-rose-200 bg-rose-50 px-5 py-3 font-bold text-rose-800 hover:bg-rose-100">{esFavorito ? "♥ Quitar de favoritos" : "♡ Guardar en favoritos"}</button></div><p className="mt-7 text-slate-800">{propiedad.descripcion || "Un alojamiento preparado para una estadía cómoda."}</p><p className="mt-5 font-semibold text-slate-950">Hasta {propiedad.capacidad} huéspedes · ${Number(propiedad.precio_noche).toLocaleString("es-AR")} por noche</p><div className="mt-5 flex flex-wrap gap-2">{propiedad.amenidades.map((amenidad) => <span key={amenidad.id} className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-900">{amenidad.nombre}</span>)}</div><Link href="/reservar" className="mt-8 inline-block rounded-xl bg-rose-600 px-6 py-3 font-bold text-white hover:bg-rose-700">Reservar este alojamiento</Link></div></article>}</section></main>;
}
