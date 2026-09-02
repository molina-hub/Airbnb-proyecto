const configuredUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";
const API_URL = `${configuredUrl.replace(/\/$/, "").replace(/\/api$/, "")}/api`;
const REQUEST_TIMEOUT_MS = 10_000;

export class ApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
  }
}

function mensajeAmigable(message: unknown, status?: number): string {
  const texto = typeof message === "string" ? message : "";
  const normalizado = texto.toLowerCase();
  if (status === 401) return "Tu sesión venció o las credenciales son incorrectas. Iniciá sesión nuevamente.";
  if (normalizado.includes("password") || normalizado.includes("contraseña")) return "La contraseña es incorrecta.";
  if (normalizado.includes("sqlalchemy") || normalizado.includes("psycopg") || normalizado.includes("traceback") || normalizado.includes("internal server error")) return "No pudimos completar la operación. Intentá nuevamente en unos instantes.";
  if (normalizado.includes("failed to fetch")) return "No se pudo conectar con la API. Verificá que el backend esté activo.";
  return texto || "No se pudo completar la operación. Intentá nuevamente.";
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const abortFromCaller = () => controller.abort();
  options.signal?.addEventListener("abort", abortFromCaller, { once: true });

  try {
    const token = typeof window === "undefined" ? null : localStorage.getItem("airbnb_token");
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers },
    });
    if (response.status === 204) return undefined as T;
    const body = await response.json().catch(() => null);
    if (!response.ok) throw new ApiError(mensajeAmigable(body?.detail, response.status), response.status);
    return body as T;
  } catch (cause) {
    if (cause instanceof DOMException && cause.name === "AbortError") {
      throw new ApiError("La API no respondió en 10 segundos. Verificá que el backend y PostgreSQL estén activos.", 408);
    }
    if (cause instanceof TypeError) {
      throw new ApiError("No se pudo conectar con la API. Verificá que el backend esté ejecutándose en http://127.0.0.1:8000.", 0);
    }
    throw cause;
  } finally {
    window.clearTimeout(timeout);
    options.signal?.removeEventListener("abort", abortFromCaller);
  }
}

export function errorMessage(error: unknown): string {
  if (error instanceof ApiError) return mensajeAmigable(error.message, error.status);
  if (error instanceof TypeError) return "No se pudo conectar con la API. Intentá nuevamente en unos instantes.";
  return error instanceof Error ? mensajeAmigable(error.message) : "Ocurrió un error inesperado.";
}
