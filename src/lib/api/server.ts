import "server-only";

/** Backend origin for server-side requests (falls back to the public URL). */
const API_ORIGIN = (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
  }
}

interface CacheOptions {
  /** Seconds before the cached response is refreshed in the background. */
  revalidate: number;
  /** Tags for on-demand invalidation via revalidateTag. */
  tags: string[];
}

/**
 * Cached GET against the backend. Responses are stored in the Next.js Data Cache,
 * shared across requests and users, and refreshed by time or by tag.
 * Identical calls during one render are deduplicated automatically.
 */
export async function apiGetBody<B>(path: string, { revalidate, tags }: CacheOptions): Promise<B> {
  let res: Response;
  try {
    res = await fetch(`${API_ORIGIN}${path}`, {
      headers: { Accept: "application/json" },
      next: { revalidate, tags },
      signal: AbortSignal.timeout(10_000),
    });
  } catch (err) {
    throw new ApiError(503, `API unreachable (${path}): ${(err as Error).message}`);
  }

  if (!res.ok) {
    let message = `API ${res.status} for ${path}`;
    try {
      message = ((await res.json()) as { message?: string }).message || message;
    } catch {
      // non-JSON error body
    }
    throw new ApiError(res.status, message);
  }

  return (await res.json()) as B;
}

/** Cached GET returning the `data` field of the standard { success, data } envelope. */
export async function apiGet<T>(path: string, options: CacheOptions): Promise<T> {
  return (await apiGetBody<{ data: T }>(path, options)).data;
}

/** Build a query string, skipping empty values. */
export const toQuery = (params: Record<string, string | number | undefined | null>) => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") search.set(key, String(value));
  });
  const qs = search.toString();
  return qs ? `?${qs}` : "";
};
