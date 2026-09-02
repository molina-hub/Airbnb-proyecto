"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "../../components/navbar";
import { useAuth } from "../../components/auth-provider";
import { api, errorMessage } from "../../lib/api";

type Usuario = { id: number; email: string; nombre: string; es_anfitrion: boolean };

export default function RegistroPage() {
  const [modo, setModo] = useState<"login" | "registro">("registro");
  const [nombre, setNombre] = useState(""); const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [anfitrion, setAnfitrion] = useState(false);
  const [error, setError] = useState(""); const [enviando, setEnviando] = useState(false);
  const { iniciarSesion } = useAuth(); const router = useRouter();
  async function enviar(event: FormEvent) { event.preventDefault(); setError(""); if (password.length < 8) { setError("La contraseña debe tener al menos 8 caracteres."); return; } setEnviando(true); try { if (modo === "registro") await api<Usuario>("/usuarios", {method:"POST", body: JSON.stringify({nombre, email, password, es_anfitrion: anfitrion})}); await iniciarSesion(email, password); router.push("/"); } catch (cause) { setError(errorMessage(cause)); } finally { setEnviando(false); } }
  return <main className="min-h-screen bg-slate-50"><Navbar/><section className="mx-auto max-w-md px-6 py-14"><div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50"><div className="flex rounded-xl bg-slate-100 p-1"><button onClick={() => setModo("registro")} className={`flex-1 rounded-lg py-2 font-semibold ${modo === "registro" ? "bg-white shadow text-slate-950" : "text-slate-600"}`}>Crear cuenta</button><button onClick={() => setModo("login")} className={`flex-1 rounded-lg py-2 font-semibold ${modo === "login" ? "bg-white shadow text-slate-950" : "text-slate-600"}`}>Iniciar sesión</button></div><h1 className="mt-7 text-3xl font-bold text-slate-950">{modo === "registro" ? "Unite a Airbnb" : "Qué bueno verte"}</h1><form onSubmit={enviar} className="mt-6 space-y-4">{modo === "registro" && <label className="block font-semibold text-slate-800">Nombre<input className="campo mt-1" required value={nombre} onChange={e=>setNombre(e.target.value)}/></label>}<label className="block font-semibold text-slate-800">Email<input className="campo mt-1" type="email" required value={email} onChange={e=>setEmail(e.target.value)}/></label><label className="block font-semibold text-slate-800">Contraseña<input className="campo mt-1" type="password" minLength={8} required value={password} onChange={e=>setPassword(e.target.value)}/></label>{modo === "registro" && <label className="flex gap-3 rounded-xl border border-slate-200 p-4 font-medium text-slate-800"><input type="checkbox" checked={anfitrion} onChange={e=>setAnfitrion(e.target.checked)}/> Quiero publicar propiedades</label>}{error && <p role="alert" className="rounded-xl bg-red-100 p-3 font-medium text-red-800">{error}</p>}<button disabled={enviando} className="w-full rounded-xl bg-rose-600 py-3 font-bold text-white hover:bg-rose-700 disabled:bg-rose-300">{enviando ? "Procesando…" : modo === "registro" ? "Crear cuenta" : "Iniciar sesión"}</button></form></div></section></main>;
}
