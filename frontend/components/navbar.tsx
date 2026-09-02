"use client";

import Link from "next/link";
import { useAuth } from "./auth-provider";

export function Navbar() {
  const { usuario, listo, cerrarSesion } = useAuth();
  return <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur"><div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4"><Link href="/" className="text-3xl font-black tracking-tight text-rose-600">airbnb</Link><nav className="flex items-center gap-4 text-sm font-semibold text-slate-800"><Link href="/buscar" className="hover:text-rose-600">Alojamientos</Link>{usuario && <><Link href="/reservas" className="hover:text-rose-600">Mis reservas</Link><Link href="/favoritos" className="hover:text-rose-600">Favoritos</Link>{usuario.es_anfitrion && <Link href="/publicar" className="rounded-full bg-slate-900 px-4 py-2 text-white hover:bg-slate-700">Publicar propiedad</Link>}</>}{!listo ? null : usuario ? <div className="flex items-center gap-2 border-l pl-4"><span className="max-w-36 truncate text-slate-600" title={usuario.email}>{usuario.nombre}</span><button onClick={cerrarSesion} className="rounded-full border border-slate-300 px-3 py-1.5 hover:bg-slate-100">Cerrar sesión</button></div> : <Link href="/registro" className="rounded-full border border-slate-300 px-4 py-2 hover:bg-slate-100">Iniciar sesión</Link>}</nav></div></header>;
}
