// Thin fetch layer. All API errors surface as ApiError with the server's
// human-readable message — screens render that message, not a generic apology.

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(path, {
      ...init,
      headers: { 'content-type': 'application/json', ...(init?.headers ?? {}) },
    });
  } catch {
    throw new ApiError(0, 'The network dropped mid-request. Check your connection and try again.');
  }
  const data = (await res.json().catch(() => null)) as ({ error?: string } & T) | null;
  if (!res.ok) {
    throw new ApiError(res.status, data?.error ?? `The server returned ${res.status}. Try again; if it repeats, reload the page.`);
  }
  return data as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: 'POST', body: JSON.stringify(body ?? {}) }),
};

// Fire-and-forget instrumentation; never blocks or breaks the UI.
export function track(type: string, payload?: unknown) {
  api.post('/api/event', { type, payload }).catch(() => {});
}
