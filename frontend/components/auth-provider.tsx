"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../lib/api";

export type UsuarioActivo = { id: number; email: string; nombre: string; es_anfitrion: boolean };
type AuthContextValue = { usuario: UsuarioActivo | null; listo: boolean; iniciarSesion: (email: string, password: string) => Promise<UsuarioActivo>; cerrarSesion: () => void; establecerUsuario: (usuario: UsuarioActivo, token: string) => void };
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioActivo | null>(null);
  const [listo, setListo] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const raw = localStorage.getItem("airbnb_usuario");
      if (raw) setUsuario(JSON.parse(raw) as UsuarioActivo);
      setListo(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  function establecerUsuario(perfil: UsuarioActivo, token: string) {
    localStorage.setItem("airbnb_token", token);
    localStorage.setItem("airbnb_usuario", JSON.stringify(perfil));
    setUsuario(perfil);
  }
  async function iniciarSesion(email: string, password: string) {
    const data = await api<{ access_token: string; usuario: UsuarioActivo }>("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
    establecerUsuario(data.usuario, data.access_token);
    return data.usuario;
  }
  function cerrarSesion() { localStorage.removeItem("airbnb_token"); localStorage.removeItem("airbnb_usuario"); setUsuario(null); }
  return <AuthContext.Provider value={{ usuario, listo, iniciarSesion, cerrarSesion, establecerUsuario }}>{children}</AuthContext.Provider>;
}

export function useAuth() { const value = useContext(AuthContext); if (!value) throw new Error("useAuth debe usarse dentro de AuthProvider"); return value; }
