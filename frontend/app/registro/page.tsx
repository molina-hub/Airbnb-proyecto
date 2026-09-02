"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "../../components/navbar";
import { useAuth } from "../../components/auth-provider";
import { api, errorMessage } from "../../lib/api";

type Usuario = { id: number; email: string; nombre: string; es_anfitrion: boolean };
type Campo = "nombre" | "email" | "password";

export default function RegistroPage() {
  const [modo, setModo] = useState<"login" | "registro">("registro");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [anfitrion, setAnfitrion] = useState(false);
  const [errores, setErrores] = useState<Partial<Record<Campo, string>>>({});
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);
  const { iniciarSesion } = useAuth();
  const router = useRouter();

  function cambiarModo(nuevoModo: "login" | "registro") {
    setModo(nuevoModo); setError(""); setErrores({});
  }

  function validar(): boolean {
    const nuevos: Partial<Record<Campo, string>> = {};
    if (modo === "registro" && !nombre.trim()) nuevos.nombre = "Ingresá tu nombre.";
    if (!email.trim()) nuevos.email = "Ingresá tu email.";
    else if (!/^\S+@\S+\.\S+$/.test(email.trim())) nuevos.email = "Ingresá un email válido.";
    if (!password) nuevos.password = "Ingresá tu contraseña.";
    else if (modo === "registro" && password.length < 8) nuevos.password = "La contraseña debe tener al menos 8 caracteres.";
    setErrores(nuevos);
    return Object.keys(nuevos).length === 0;
  }

  async function enviar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!validar()) return;
    setEnviando(true);
    try {
      const emailNormalizado = email.trim().toLowerCase();
      if (modo === "registro") await api<Usuario>("/usuarios", { method: "POST", body: JSON.stringify({ nombre: nombre.trim(), email: emailNormalizado, password, es_anfitrion: anfitrion }) });
      await iniciarSesion(emailNormalizado, password);
      router.push("/");
    } catch (cause) {
      setError(errorMessage(cause));
    } finally { setEnviando(false); }
  }

  const claseCampo = (campo: Campo) => `campo mt-1 ${errores[campo] ? "border-red-500" : ""}`;

  return <main className="min-h-screen bg-slate-50"><Navbar /><section className="mx-auto max-w-md px-6 py-14"><div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50"><div className="flex rounded-xl bg-slate-100 p-1"><button type="button" onClick={() => cambiarModo("registro")} className={`flex-1 rounded-lg py-2 font-semibold ${modo === "registro" ? "bg-white text-slate-950 shadow" : "text-slate-700"}`}>Crear cuenta</button><button type="button" onClick={() => cambiarModo("login")} className={`flex-1 rounded-lg py-2 font-semibold ${modo === "login" ? "bg-white text-slate-950 shadow" : "text-slate-700"}`}>Iniciar sesión</button></div><h1 className="mt-7 text-3xl font-bold text-slate-950">{modo === "registro" ? "Unite a Airbnb" : "Qué bueno verte"}</h1><form noValidate onSubmit={enviar} className="mt-6 space-y-4">{modo === "registro" && <label className="block font-semibold text-slate-900">Nombre<input aria-invalid={Boolean(errores.nombre)} className={claseCampo("nombre")} value={nombre} onChange={(e) => { setNombre(e.target.value); setErrores((actual) => ({ ...actual, nombre: undefined })); }} />{errores.nombre && <span className="mt-1 block text-sm text-red-700">{errores.nombre}</span>}</label>}<label className="block font-semibold text-slate-900">Email<input aria-invalid={Boolean(errores.email)} className={claseCampo("email")} type="email" value={email} onChange={(e) => { setEmail(e.target.value); setErrores((actual) => ({ ...actual, email: undefined })); }} />{errores.email && <span className="mt-1 block text-sm text-red-700">{errores.email}</span>}</label><label className="block font-semibold text-slate-900">Contraseña<input aria-invalid={Boolean(errores.password)} className={claseCampo("password")} type="password" value={password} onChange={(e) => { setPassword(e.target.value); setErrores((actual) => ({ ...actual, password: undefined })); }} />{errores.password && <span className="mt-1 block text-sm text-red-700">{errores.password}</span>}</label>{modo === "registro" && <label className="flex gap-3 rounded-xl border border-slate-200 p-4 font-medium text-slate-900"><input type="checkbox" checked={anfitrion} onChange={(e) => setAnfitrion(e.target.checked)} />Quiero publicar propiedades</label>}{error && <p role="alert" className="rounded-xl bg-red-100 p-3 font-medium text-red-800">{error}</p>}<button disabled={enviando} className="w-full rounded-xl bg-rose-600 py-3 font-bold text-white hover:bg-rose-700 disabled:bg-rose-300">{enviando ? "Procesando…" : modo === "registro" ? "Crear cuenta" : "Iniciar sesión"}</button></form></div></section></main>;
}
