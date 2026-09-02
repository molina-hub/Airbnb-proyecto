const configuredUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";
const API_URL = `${configuredUrl.replace(/\/$/, "").replace(/\/api$/, "")}/api`;
const REQUEST_TIMEOUT_MS = 10_000;

export class ApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
  }
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
    if (!response.ok) throw new ApiError(body?.detail ?? "No se pudo completar la operación.", response.status);
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
  if (error instanceof ApiError) return error.message;
  if (error instanceof TypeError) return "No se pudo conectar con la API. Intentá nuevamente en unos instantes.";
  return error instanceof Error ? error.message : "Ocurrió un error inesperado.";
}
