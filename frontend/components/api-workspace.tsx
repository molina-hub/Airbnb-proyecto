"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { api, errorMessage } from "../lib/api";
import { Navbar } from "./navbar";
import { useAuth } from "./auth-provider";

type Amenidad = { id: number; nombre: string };
type Propiedad = { id: number; titulo: string; ciudad: string; precio_noche: number; amenidades: Amenidad[]; direccion?: string; capacidad?: number; anfitrion_id?: number };
type Reserva = { id: number; propiedad_id: number; fecha_inicio: string; fecha_fin: string; estado: string; total: number; propiedad: { titulo: string; ciudad: string }; anfitrion: { id: number; nombre: string } };
type Mode = "amenidades" | "disponibilidad" | "ingresos" | "resenas" | "top" | "historial" | "gestion" | "favoritos" | "reservar" | "mispropiedades";

export default function ApiWorkspace({ mode }: { mode: Mode }) {
  const { usuario, listo } = useAuth();
  const userId = usuario?.id ?? 0;
  const hostId = usuario?.id ?? 0;
  const [propiedades, setPropiedades] = useState<Propiedad[]>([]);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [amenidades, setAmenidades] = useState<Amenidad[]>([]);
  const [seleccion, setSeleccion] = useState<number>(0);
  const [mes, setMes] = useState("2026-09");
  const [desde, setDesde] = useState("2026-08-01");
  const [hasta, setHasta] = useState("2026-09-30");
  const [ciudad, setCiudad] = useState("");
  const [resultado, setResultado] = useState<unknown>(null);
  const [favoritos, setFavoritos] = useState<Propiedad[]>([]);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);

  const cargar = useCallback(async () => {
    if (!usuario) { setCargando(false); return; }
    setError("");
    setCargando(true);
    try {
      if (mode === "amenidades" || mode === "disponibilidad") {
        const [listaPropiedades, listaAmenidades] = await Promise.all([api<Propiedad[]>("/propiedades"), api<Amenidad[]>("/amenidades")]);
        setPropiedades(listaPropiedades); setAmenidades(listaAmenidades); setSeleccion((actual) => actual || listaPropiedades[0]?.id || 0);
      }
      if (mode === "reservar") {
        const listaPropiedades = await api<Propiedad[]>("/propiedades");
        setPropiedades(listaPropiedades); setSeleccion((actual) => actual || listaPropiedades[0]?.id || 0);
      }
      if (mode === "favoritos") {
        setFavoritos(await api<Propiedad[]>("/favoritos"));
      }
      if (mode === "mispropiedades") setPropiedades(await api<Propiedad[]>(`/anfitriones/${hostId}/propiedades`));
      if (mode === "resenas" || mode === "historial") setReservas(await api<Reserva[]>("/reservas"));
      if (mode === "gestion") setReservas(await api<Reserva[]>(`/anfitriones/${hostId}/reservas`));
      if (mode === "top") setResultado(await api<unknown[]>("/propiedades/top"));
    } catch (cause) {
      setError(errorMessage(cause));
      if (mode === "favoritos") { setFavoritos([]); setPropiedades([]); }
      if (mode === "historial" || mode === "resenas" || mode === "gestion") setReservas([]);
    }
    finally { setCargando(false); }
  }, [mode, usuario, hostId]);

  useEffect(() => {
    const timer = window.setTimeout(() => { void cargar(); }, 0);
    return () => window.clearTimeout(timer);
  }, [cargar]);

  const ejecutar = async (action: () => Promise<unknown>, ok: string) => {
    setError("");
    setProcesando(true);
    try { setResultado(await action()); setMensaje(ok); await cargar(); } catch (cause) { setError(errorMessage(cause)); }
    finally { setProcesando(false); }
  };

  const seleccionada = propiedades.find((p) => p.id === seleccion);

  const contenido = () => {
    if (mode === "amenidades") return <>
      <select value={seleccion} onChange={(e) => setSeleccion(Number(e.target.value))}>{propiedades.map((p) => <option key={p.id} value={p.id}>{p.titulo} — {p.ciudad}</option>)}</select>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">{amenidades.map((a) => <label key={a.id}><input type="checkbox" checked={seleccionada?.amenidades.some((actual) => actual.id === a.id) ?? false} onChange={() => setPropiedades((lista) => lista.map((p) => p.id !== seleccion ? p : {...p, amenidades: p.amenidades.some((x) => x.id === a.id) ? p.amenidades.filter((x) => x.id !== a.id) : [...p.amenidades, a]}))} /> {a.nombre}</label>)}</div>
      <button className="mt-5 rounded bg-rose-500 px-4 py-2 text-white" onClick={() => seleccionada && void ejecutar(() => api(`/propiedades/${seleccion}/amenidades`, {method: "PUT", body: JSON.stringify({amenidad_ids: seleccionada.amenidades.map((a) => a.id)})}), "Amenidades guardadas.")}>Guardar</button>
    </>;
    if (mode === "disponibilidad") return <>
      <select value={seleccion} onChange={(e) => setSeleccion(Number(e.target.value))}>{propiedades.map((p) => <option key={p.id} value={p.id}>{p.titulo}</option>)}</select><input className="ml-3" type="month" value={mes} onChange={(e) => setMes(e.target.value)} />
      <button className="ml-3 rounded bg-rose-500 px-4 py-2 text-white" onClick={() => void ejecutar(() => api(`/propiedades/${seleccion}/disponibilidad?mes=${mes}`), "Calendario actualizado.")}>Consultar</button>
      {resultado && <Dias calendario={resultado as {dias: {fecha: string; estado: string}[]}} />}
    </>;
    if (mode === "ingresos") return <><input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} /><input className="ml-3" type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} /><button className="ml-3 rounded bg-rose-500 px-4 py-2 text-white" onClick={() => void ejecutar(() => api(`/anfitriones/${hostId}/ingresos?desde=${desde}&hasta=${hasta}`), "Ingresos consultados.")}>Consultar</button>{resultado && <pre>{JSON.stringify(resultado, null, 2)}</pre>}</>;
    if (mode === "top") return <><input value={ciudad} placeholder="Ciudad (opcional)" onChange={(e) => setCiudad(e.target.value)} /><button className="ml-3 rounded bg-rose-500 px-4 py-2 text-white" onClick={() => void ejecutar(() => api(`/propiedades/top${ciudad ? `?ciudad=${encodeURIComponent(ciudad)}` : ""}`), "Ranking actualizado.")}>Buscar</button><Listado datos={resultado} /></>;
    if (mode === "reservar") return <><select value={seleccion} onChange={(e) => setSeleccion(Number(e.target.value))}>{propiedades.map((p) => <option key={p.id} value={p.id}>{p.titulo} — ${p.precio_noche}/noche</option>)}</select><input className="ml-3" type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} /><input className="ml-3" type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} /><button className="ml-3 rounded bg-rose-500 px-4 py-2 text-white" onClick={() => void ejecutar(() => api("/reservas", {method: "POST", body: JSON.stringify({propiedad_id: seleccion, huesped_id: userId, fecha_inicio: fechaInicio, fecha_fin: fechaFin})}), "Reserva creada en estado pendiente.")}>Reservar</button></>;
    if (mode === "favoritos") return <div className="space-y-3">{favoritos.length === 0 ? <p className="rounded-xl bg-slate-100 p-4 text-slate-700">Todavía no tenés propiedades favoritas.</p> : favoritos.map((p) => <article key={p.id} className="rounded border p-4"><strong>{p.titulo}</strong> — {p.ciudad}<button className="ml-3 rounded bg-rose-500 px-3 py-1 text-white" onClick={() => void ejecutar(() => api(`/usuarios/${userId}/favoritos/${p.id}`, {method: "DELETE"}), "Favorito eliminado.")}>Quitar</button></article>)}</div>;
    if (mode === "mispropiedades") return <div className="space-y-3">{propiedades.map((p) => <article key={p.id} className="rounded border p-4"><strong>{p.titulo}</strong> — {p.ciudad} — ${p.precio_noche}<button className="ml-3 rounded bg-red-600 px-3 py-1 text-white" onClick={() => void ejecutar(() => api(`/propiedades/${p.id}`, {method: "DELETE"}), "Propiedad eliminada.")}>Eliminar</button></article>)}{propiedades.length === 0 && <p>No hay propiedades publicadas.</p>}</div>;
    if (mode === "historial") return <Reservas reservas={reservas} />;
    if (mode === "gestion") return <Reservas reservas={reservas} accion={(reserva, estado) => void ejecutar(() => api(`/reservas/${reserva.id}/estado`, {method: "PATCH", body: JSON.stringify({estado, anfitrion_id: hostId})}), `Reserva ${estado}.`)} />;
    return <Resenas reservas={reservas} ejecutar={ejecutar} autorId={userId} />;
  };

  const titulos: Record<Mode, string> = {amenidades: "Amenidades", disponibilidad: "Disponibilidad", ingresos: "Ingresos del anfitrión", resenas: "Reseñas", top: "Top propiedades", historial: "Mis reservas", gestion: "Gestionar reservas", favoritos: "Favoritos", reservar: "Reservar", mispropiedades: "Mis propiedades"};
  if (!listo) return <main className="min-h-screen bg-slate-50"><Navbar/><p className="p-8">Cargando sesión…</p></main>;
  if (!usuario) return <main className="min-h-screen bg-slate-50"><Navbar/><section className="mx-auto max-w-xl p-10"><h1 className="text-3xl font-bold">Necesitás iniciar sesión</h1><p className="mt-3 text-slate-700">Esta sección usa tu perfil para mostrar y gestionar tus datos.</p><a className="mt-5 inline-block rounded-xl bg-rose-600 px-5 py-3 font-bold text-white" href="/registro">Iniciar sesión</a></section></main>;
  return <main className="min-h-screen bg-slate-50"><Navbar/><section className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50"><h1 className="text-3xl font-bold text-slate-950">{titulos[mode]}</h1><p className="mt-2 text-slate-700">Datos obtenidos directamente desde la API.</p>{cargando && <p className="mt-4 rounded bg-blue-50 p-3 text-blue-800" role="status">Cargando datos…</p>}{procesando && <p className="mt-4 rounded bg-blue-50 p-3 text-blue-800" role="status">Procesando operación…</p>}{error && <p className="mt-4 rounded bg-amber-50 p-3 text-amber-900" role="alert">{error} Podés reintentar cuando el servicio esté disponible.</p>}{mensaje && <p className="mt-4 rounded bg-green-100 p-3 text-green-700">{mensaje}</p>}<fieldset className="mt-6 disabled:opacity-60" disabled={cargando || procesando}>{contenido()}</fieldset></section></main>;
}

function Listado({ datos }: { datos: unknown }) { return <pre className="mt-5 overflow-auto rounded bg-gray-100 p-4 text-sm">{JSON.stringify(datos, null, 2)}</pre>; }
function Dias({ calendario }: { calendario: { dias: {fecha: string; estado: string}[]}}) { return <div className="mt-5 grid grid-cols-4 gap-2">{calendario.dias.map((d) => <span key={d.fecha} className={d.estado === "ocupado" ? "rounded bg-red-100 p-2" : "rounded bg-green-100 p-2"}>{d.fecha}: {d.estado}</span>)}</div>; }
function Reservas({ reservas, accion }: { reservas: Reserva[]; accion?: (reserva: Reserva, estado: string) => void }) { return <div className="space-y-3">{reservas.map((r) => <article className="rounded border p-4" key={r.id}><strong>{r.propiedad.titulo}</strong><p>{r.fecha_inicio} a {r.fecha_fin} — {r.estado} — ${r.total}</p>{accion && r.estado === "pendiente" && <><button className="mr-2 rounded bg-green-600 px-3 py-1 text-white" onClick={() => accion(r, "confirmada")}>Confirmar</button><button className="rounded bg-red-600 px-3 py-1 text-white" onClick={() => accion(r, "rechazada")}>Rechazar</button></>}{accion && r.estado === "confirmada" && <button className="rounded bg-gray-700 px-3 py-1 text-white" onClick={() => accion(r, "cancelada")}>Cancelar</button>}</article>)}{reservas.length === 0 && <p>No hay reservas.</p>}</div>; }
function Resenas({ reservas, ejecutar, autorId }: { reservas: Reserva[]; ejecutar: (action: () => Promise<unknown>, ok: string) => Promise<void>; autorId: number }) { const [id, setId] = useState(0); const [puntaje, setPuntaje] = useState(5); const [comentario, setComentario] = useState(""); const reserva = reservas.find((r) => r.id === id); const submit = (event: FormEvent) => { event.preventDefault(); if (reserva) void ejecutar(() => api(`/propiedades/${reserva.propiedad_id}/resenas`, {method: "POST", body: JSON.stringify({reserva_id: reserva.id, autor_id: autorId, puntaje, comentario})}), "Reseña creada."); }; return <form onSubmit={submit} className="space-y-3"><select value={id} onChange={(e) => setId(Number(e.target.value))}><option value="0">Elegí una reserva</option>{reservas.map((r) => <option key={r.id} value={r.id}>{r.propiedad.titulo} ({r.fecha_fin})</option>)}</select><input className="ml-3" type="number" min="1" max="5" value={puntaje} onChange={(e) => setPuntaje(Number(e.target.value))}/><textarea className="block w-full border p-2" value={comentario} onChange={(e) => setComentario(e.target.value)} placeholder="Comentario"/><button className="rounded bg-rose-500 px-4 py-2 text-white">Publicar reseña</button><Reservas reservas={reservas}/></form>; }
