/** Base URL for main FastAPI (main.py), without trailing slash or `/api` suffix. */
export function getMainApiBase(): string {
  const fromEnv =
    import.meta.env.VITE_API_BASE_URL ??
    (import.meta.env.VITE_BACKEND_URL as string | undefined);
  const raw = (fromEnv || 'http://127.0.0.1:5000').replace(/\/$/, '');
  return raw.replace(/\/api\/?$/i, '');
}
