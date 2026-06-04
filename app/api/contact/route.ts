import { NextRequest, NextResponse } from "next/server";

/**
 * Hardened contact endpoint (the only place that accepts user input).
 * - IP-based rate limiting with graceful 429s.
 * - Strict, schema-based validation: type checks, length limits, required
 *   fields, and rejection of any unexpected field.
 * - Honeypot ("company") field to drop bots.
 * - Secure key handling: the email-provider key is read from server-side env
 *   only and is NEVER sent to the client. If no provider is configured the
 *   route responds { delivered:false } and the client falls back to mailto,
 *   so nothing breaks out of the box.
 *
 * Follows OWASP input-validation + rate-limiting guidance.
 */

export const runtime = "nodejs"; // keep in-memory limiter state within an instance
export const dynamic = "force-dynamic";

/* --------------------------------------------------------------------------
   Rate limiting (IP-based). Sensible default: 5 requests / 60s / IP.
   In-memory is fine for a single instance; for multi-instance / serverless
   scale, swap this for a shared store (e.g. Upstash Redis) — same interface.
   -------------------------------------------------------------------------- */
type Bucket = { count: number; reset: number };
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, Bucket>();

function rateLimit(key: string) {
  const now = Date.now();
  const b = hits.get(key);
  if (!b || now > b.reset) {
    hits.set(key, { count: 1, reset: now + WINDOW_MS });
    return { ok: true, retryAfter: 0 };
  }
  if (b.count >= MAX_PER_WINDOW) {
    return { ok: false, retryAfter: Math.ceil((b.reset - now) / 1000) };
  }
  b.count++;
  return { ok: true, retryAfter: 0 };
}

// Opportunistic cleanup so the map can't grow unbounded.
function sweep() {
  if (hits.size < 5000) return;
  const now = Date.now();
  for (const [k, v] of hits) if (now > v.reset) hits.delete(k);
}

function getIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

/* --------------------------------------------------------------------------
   Strict validation
   -------------------------------------------------------------------------- */
const ALLOWED: Record<"call" | "quote", Set<string>> = {
  call: new Set(["type", "name", "email", "phone", "time", "msg", "company"]),
  quote: new Set(["type", "name", "email", "business", "budget", "details", "company"]),
};
const MAX_LEN: Record<string, number> = {
  name: 120,
  email: 160,
  phone: 40,
  time: 80,
  msg: 2000,
  business: 120,
  budget: 40,
  details: 4000,
};
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Clean = Record<string, string> & { type: "call" | "quote" };

function validate(body: unknown): { data: Clean } | { error: string } {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return { error: "Invalid payload." };
  }
  const obj = body as Record<string, unknown>;
  const type: "call" | "quote" = obj.type === "quote" ? "quote" : "call";
  const allowed = ALLOWED[type];

  // Reject unexpected fields outright.
  for (const k of Object.keys(obj)) {
    if (!allowed.has(k)) return { error: `Unexpected field: ${k}` };
  }

  // Honeypot — bots fill hidden fields; humans never do.
  if (typeof obj.company === "string" && obj.company.trim() !== "") {
    return { error: "Rejected." };
  }

  const name = typeof obj.name === "string" ? obj.name.trim() : "";
  const email = typeof obj.email === "string" ? obj.email.trim() : "";
  if (name.length < 1 || name.length > MAX_LEN.name) return { error: "A valid name is required." };
  if (!EMAIL_RE.test(email) || email.length > MAX_LEN.email) {
    return { error: "A valid email is required." };
  }

  const clean = { type } as Clean;
  for (const [k, v] of Object.entries(obj)) {
    if (k === "type" || k === "company") continue;
    if (typeof v !== "string") return { error: `Invalid value for ${k}.` };
    if (v.length > (MAX_LEN[k] ?? 200)) return { error: `${k} is too long.` };
    clean[k] = v.trim();
  }
  return { data: clean };
}

/* --------------------------------------------------------------------------
   Delivery — env-keyed (Resend by default). Returns false when unconfigured.
   -------------------------------------------------------------------------- */
async function deliver(data: Clean): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!key || !to || !from) return false; // not configured → client mailto fallback

  const subject =
    data.type === "quote"
      ? `Quote request — ${data.business || data.name}`
      : `Book a call — ${data.name}`;
  const text = Object.entries(data)
    .filter(([k]) => k !== "type")
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to, reply_to: data.email, subject, text }),
  });
  return res.ok;
}

/* --------------------------------------------------------------------------
   Autoresponder — a transactional confirmation back to the person who wrote
   in (a reply to a solicited inquiry, so CASL-safe). Best-effort: never blocks
   or fails the request. Skipped when no provider is configured.
   -------------------------------------------------------------------------- */
async function acknowledge(data: Clean): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const replyTo = process.env.CONTACT_TO_EMAIL;
  if (!key || !from || !data.email) return;

  const first = (data.name || "there").split(/\s+/)[0];
  const line =
    data.type === "quote"
      ? "I've got your project details and I'll send a clear, fixed-price estimate within one business day."
      : "I've got your call request and I'll reply within one business day to lock in a time.";
  const text = `Hi ${first},

Thanks for reaching out to Auvance — this is a quick note to confirm I received your message.

${line}

You'll always work directly with me — a real person, not a ticket queue.

— Auvance
Vancouver web studio`;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: data.email,
      reply_to: replyTo,
      subject: "Thanks — I've got your message (Auvance)",
      text,
    }),
  });
}

export async function POST(req: NextRequest) {
  sweep();

  const rl = rateLimit(getIp(req));
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many requests — please try again in a moment." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
    );
  }

  // Reject oversized bodies early (defense in depth).
  const len = Number(req.headers.get("content-length") || 0);
  if (len > 20_000) {
    return NextResponse.json({ ok: false, error: "Payload too large." }, { status: 413 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  const result = validate(body);
  if ("error" in result) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
  }

  try {
    const delivered = await deliver(result.data);
    // Fire the confirmation back to the sender — best-effort, never blocks.
    if (delivered) acknowledge(result.data).catch(() => {});
    return NextResponse.json({ ok: true, delivered });
  } catch {
    // Never leak provider errors/keys to the client.
    return NextResponse.json({ ok: true, delivered: false });
  }
}

// Explicitly reject other verbs.
export function GET() {
  return NextResponse.json({ ok: false, error: "Method not allowed." }, { status: 405 });
}
