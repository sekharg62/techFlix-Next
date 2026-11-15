import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { REVALIDATABLE_TAGS } from "@/lib/api/tags";

/**
 * On-demand cache invalidation, called by the backend after admin changes.
 *   POST /api/revalidate   header x-revalidate-secret   body { "tags": ["products"] }
 */
export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  const provided = request.headers.get("x-revalidate-secret") || "";

  if (!secret || provided.length !== secret.length || !timingSafeEqual(Buffer.from(provided), Buffer.from(secret))) {
    return Response.json({ revalidated: false, message: "Invalid secret" }, { status: 401 });
  }

  let tags: unknown;
  try {
    tags = ((await request.json()) as { tags?: unknown }).tags;
  } catch {
    return Response.json({ revalidated: false, message: "Body must be JSON" }, { status: 400 });
  }

  const valid = Array.isArray(tags)
    ? tags.filter(
        (t): t is string =>
          typeof t === "string" && (REVALIDATABLE_TAGS.has(t) || (t.startsWith("product:") && t.length <= 200))
      )
    : [];

  if (valid.length === 0) {
    return Response.json({ revalidated: false, message: "No valid tags" }, { status: 400 });
  }

  // Expire immediately: the next visitor gets fresh data after an admin change
  valid.forEach((tag) => revalidateTag(tag, { expire: 0 }));

  return Response.json({ revalidated: true, tags: valid, now: Date.now() });
}
