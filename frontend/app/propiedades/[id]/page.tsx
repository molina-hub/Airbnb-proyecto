"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useParams } from "next/navigation";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Navbar } from "../../../components/navbar";
import { useAuth } from "../../../components/auth-provider";
import { api, errorMessage } from "../../../lib/api";

type Propiedad = { id: number; titulo: string; ciudad: string; direccion: string; descripcion?: string | null; imagen_url?: string | null; precio_noche: number; capacidad: number; amenidades: { id: number; nombre: string }[] };
type Resena = { id: number; reserva_id: number; puntaje: number; comentario?: string | null; fecha: string; autor: { nombre: string } };
type Reserva = { id: number; propiedad_id: number; fecha_fin: string; estado: string };
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

  return <main className="min-h-screen bg-slate-50 text-slate-950"><Navbar /><section className="mx-auto max-w-5xl px-6 py-12">{cargando ? <p role="status" className="text-slate-900">Cargando alojamiento…</p> : error ? <p role="alert" className="rounded-xl bg-amber-50 p-4 font-medium text-amber-900">{error}</p> : propiedad && <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl"><img src={propiedad.imagen_url || IMAGEN_PREDETERMINADA} onError={(event) => { event.currentTarget.src = IMAGEN_PREDETERMINADA; }} alt={propiedad.titulo} className="h-80 w-full object-cover" /><div className="p-8"><div className="flex flex-wrap items-start justify-between gap-5"><div><h1 className="text-4xl font-bold text-slate-950">{propiedad.titulo}</h1><p className="mt-2 text-lg text-slate-800">{propiedad.ciudad} · {propiedad.direccion}</p></div><button onClick={() => void alternarFavorito()} className="rounded-full border border-rose-200 bg-rose-50 px-5 py-3 font-bold text-rose-800 hover:bg-rose-100">{esFavorito ? "♥ Quitar de favoritos" : "♡ Guardar en favoritos"}</button></div><p className="mt-7 text-slate-800">{propiedad.descripcion || "Un alojamiento preparado para una estadía cómoda."}</p><p className="mt-5 font-semibold text-slate-950">Hasta {propiedad.capacidad} huéspedes · ${Number(propiedad.precio_noche).toLocaleString("es-AR")} por noche</p><div className="mt-5 flex flex-wrap gap-2">{propiedad.amenidades.map((amenidad) => <span key={amenidad.id} className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-900">{amenidad.nombre}</span>)}</div><div className="mt-8 grid gap-6 lg:grid-cols-2"><CalculadoraGastos propiedad={propiedad} /><ResenasPropiedad propiedadId={propiedad.id} usuarioId={usuario?.id} /></div><Link href="/reservar" className="mt-8 inline-block rounded-xl bg-rose-600 px-6 py-3 font-bold text-white hover:bg-rose-700">Reservar este alojamiento</Link></div></article>}</section></main>;
}

function CalculadoraGastos({ propiedad }: { propiedad: Propiedad }) {
  const [noches, setNoches] = useState(1);
  const [viajeros, setViajeros] = useState(1);
  const [mensaje, setMensaje] = useState("");
  const total = Math.max(1, noches) * Number(propiedad.precio_noche);
  const porPersona = total / Math.max(1, viajeros);
  async function copiar() {
    const texto = `${propiedad.titulo}\n${noches} noche(s) × $${Number(propiedad.precio_noche).toLocaleString("es-AR")} = $${total.toLocaleString("es-AR")}\n${viajeros} viajero(s): $${porPersona.toLocaleString("es-AR", { maximumFractionDigits: 2 })} por persona`;
    try { await navigator.clipboard.writeText(texto); setMensaje("Desglose copiado. ¡Listo para compartir!"); }
    catch { setMensaje("No se pudo copiar automáticamente. Seleccioná el desglose para compartirlo."); }
  }
  return <aside className="rounded-2xl border border-rose-200 bg-rose-50 p-5"><h2 className="text-xl font-bold text-slate-950">Dividir pago</h2><p className="mt-1 text-sm text-slate-800">Calculá el costo de esta estadía entre tus viajeros.</p><div className="mt-4 grid grid-cols-2 gap-3"><label className="font-semibold text-slate-900">Noches<input className="mt-1 w-full rounded-lg border border-slate-300 p-2" min="1" type="number" value={noches} onChange={(e) => setNoches(Math.max(1, Number(e.target.value)))} /></label><label className="font-semibold text-slate-900">Viajeros<input className="mt-1 w-full rounded-lg border border-slate-300 p-2" min="1" max={propiedad.capacidad} type="number" value={viajeros} onChange={(e) => setViajeros(Math.max(1, Number(e.target.value)))} /></label></div><p className="mt-4 font-semibold text-slate-950">Total estimado: ${total.toLocaleString("es-AR")}</p><p className="text-lg font-bold text-rose-800">${porPersona.toLocaleString("es-AR", { maximumFractionDigits: 2 })} por persona</p><button type="button" onClick={() => void copiar()} className="mt-4 rounded-xl bg-slate-900 px-4 py-2 font-bold text-white hover:bg-slate-700">Copiar desglose de pago</button>{mensaje && <p className="mt-3 text-sm font-medium text-slate-900" role="status">{mensaje}</p>}</aside>;
}

function ResenasPropiedad({ propiedadId, usuarioId }: { propiedadId: number; usuarioId?: number }) {
  const [resenas, setResenas] = useState<Resena[]>([]);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [reservaId, setReservaId] = useState(0);
  const [puntaje, setPuntaje] = useState(5);
  const [comentario, setComentario] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const promedio = useMemo(() => resenas.length ? resenas.reduce((suma, item) => suma + item.puntaje, 0) / resenas.length : 0, [resenas]);
  const cargar = useCallback(async () => {
    try { setResenas(await api<Resena[]>(`/propiedades/${propiedadId}/resenas`)); if (usuarioId) setReservas(await api<Reserva[]>("/reservas")); }
    catch (cause) { setError(errorMessage(cause)); }
  }, [propiedadId, usuarioId]);
  useEffect(() => { const timer = window.setTimeout(() => { void cargar(); }, 0); return () => window.clearTimeout(timer); }, [cargar]);
  const elegibles = reservas.filter((reserva) => reserva.propiedad_id === propiedadId && reserva.estado === "confirmada" && reserva.fecha_fin < new Date().toISOString().slice(0, 10) && !resenas.some((resena) => resena.reserva_id === reserva.id));
  async function enviar(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setError(""); setMensaje(""); if (!reservaId) { setError("Elegí una reserva finalizada para publicar tu opinión."); return; } try { await api("/resenas", { method: "POST", body: JSON.stringify({ reserva_id: reservaId, puntaje, comentario: comentario.trim() || null }) }); setMensaje("Tu reseña fue publicada. ¡Gracias por compartir tu experiencia!"); setComentario(""); setReservaId(0); await cargar(); } catch (cause) { setError(errorMessage(cause)); } }
  return <section className="rounded-2xl border border-slate-200 bg-white p-5"><h2 className="text-xl font-bold text-slate-950">Opiniones</h2><p className="mt-1 font-semibold text-slate-900">★ {promedio ? promedio.toFixed(1) : "Sin calificación"} · {resenas.length} {resenas.length === 1 ? "opinión" : "opiniones"}</p>{error && <p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm font-medium text-amber-900" role="alert">{error}</p>}{usuarioId && <form onSubmit={enviar} className="mt-4 space-y-2 border-t border-slate-200 pt-4"><p className="font-semibold text-slate-900">Dejá tu reseña</p><select className="w-full rounded-lg border border-slate-300 p-2" value={reservaId} onChange={(e) => setReservaId(Number(e.target.value))}><option value="0">Elegí una estancia finalizada</option>{elegibles.map((reserva) => <option key={reserva.id} value={reserva.id}>Reserva #{reserva.id}</option>)}</select><select className="rounded-lg border border-slate-300 p-2" value={puntaje} onChange={(e) => setPuntaje(Number(e.target.value))}>{[5, 4, 3, 2, 1].map((numero) => <option key={numero} value={numero}>{numero} estrella(s)</option>)}</select><textarea className="block w-full rounded-lg border border-slate-300 p-2" value={comentario} onChange={(e) => setComentario(e.target.value)} placeholder="Contá cómo fue tu estadía" maxLength={2000} /><button className="rounded-lg bg-rose-600 px-4 py-2 font-bold text-white hover:bg-rose-700">Publicar reseña</button></form>}{mensaje && <p className="mt-3 text-sm font-medium text-green-800" role="status">{mensaje}</p>}<div className="mt-5 space-y-3">{resenas.map((resena) => <article key={resena.id} className="border-t border-slate-200 pt-3"><p className="font-semibold text-slate-950">★ {resena.puntaje} · {resena.autor.nombre}</p><p className="text-sm text-slate-700">{resena.comentario || "Sin comentario."}</p></article>)}{resenas.length === 0 && <p className="text-sm text-slate-700">Todavía no hay opiniones para este alojamiento.</p>}</div></section>;
}
