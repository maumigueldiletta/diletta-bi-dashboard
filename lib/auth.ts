import crypto from "crypto";
import { cookies } from "next/headers";

// =============================================================================
// Diletta BI · Custom Magic Link Auth (no database, no NextAuth)
// =============================================================================

const SECRET = process.env.NEXTAUTH_SECRET || "dev-only-secret-change-me";
const COOKIE_NAME = "diletta_session";
const SESSION_TTL_DAYS = 30;
const MAGIC_LINK_TTL_MIN = 15;

const allowedEmails = (process.env.ALLOWED_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

const allowedDomains = (process.env.ALLOWED_DOMAINS || "dilettasolutions.com")
  .split(",")
  .map((d) => d.trim().toLowerCase())
  .filter(Boolean);

export function isEmailAllowed(email: string): boolean {
  const e = (email || "").trim().toLowerCase();
  if (!e || !e.includes("@")) return false;
  if (allowedEmails.includes(e)) return true;
  const domain = e.split("@")[1];
  return allowedDomains.includes(domain);
}

function hmac(payload: string): string {
  return crypto.createHmac("sha256", SECRET).update(payload).digest("base64url");
}
function b64encode(obj: unknown): string {
  return Buffer.from(JSON.stringify(obj)).toString("base64url");
}
function b64decode<T>(s: string): T | null {
  try { return JSON.parse(Buffer.from(s, "base64url").toString("utf8")) as T; }
  catch { return null; }
}
function safeEq(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

type MagicPayload = { email: string; exp: number; nonce: string };

export function createMagicToken(email: string): string {
  const payload: MagicPayload = {
    email: email.toLowerCase(),
    exp: Date.now() + MAGIC_LINK_TTL_MIN * 60 * 1000,
    nonce: crypto.randomBytes(8).toString("base64url"),
  };
  const body = b64encode(payload);
  const sig = hmac(`magic.${body}`);
  return `${body}.${sig}`;
}

export function verifyMagicToken(token: string): { email: string } | null {
  const [body, sig] = (token || "").split(".");
  if (!body || !sig) return null;
  const expected = hmac(`magic.${body}`);
  if (!safeEq(sig, expected)) return null;
  const payload = b64decode<MagicPayload>(body);
  if (!payload) return null;
  if (Date.now() > payload.exp) return null;
  if (!isEmailAllowed(payload.email)) return null;
  return { email: payload.email };
}

type SessionPayload = { email: string; exp: number };

function createSessionValue(email: string): string {
  const payload: SessionPayload = {
    email: email.toLowerCase(),
    exp: Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000,
  };
  const body = b64encode(payload);
  const sig = hmac(`session.${body}`);
  return `${body}.${sig}`;
}

export function verifySessionValue(value: string): { email: string } | null {
  const [body, sig] = (value || "").split(".");
  if (!body || !sig) return null;
  const expected = hmac(`session.${body}`);
  if (!safeEq(sig, expected)) return null;
  const payload = b64decode<SessionPayload>(body);
  if (!payload) return null;
  if (Date.now() > payload.exp) return null;
  if (!isEmailAllowed(payload.email)) return null;
  return { email: payload.email };
}

export async function setSessionCookie(email: string) {
  const c = await cookies();
  c.set(COOKIE_NAME, createSessionValue(email), {
    httpOnly: true, secure: true, sameSite: "lax", path: "/",
    maxAge: SESSION_TTL_DAYS * 24 * 60 * 60,
  });
}

export async function clearSessionCookie() {
  const c = await cookies();
  c.set(COOKIE_NAME, "", { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 0 });
}

export async function getCurrentSession(): Promise<{ email: string } | null> {
  const c = await cookies();
  const v = c.get(COOKIE_NAME)?.value;
  if (!v) return null;
  return verifySessionValue(v);
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
