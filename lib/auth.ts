// =============================================================================
// Diletta BI · Auth core (Edge-safe, uses Web Crypto API)
// Works in both Edge Runtime (middleware) and Node Runtime (API routes).
// Do NOT import next/headers here — keep it in lib/auth-server.ts.
// =============================================================================

const SECRET = process.env.NEXTAUTH_SECRET || "dev-only-secret-change-me";
const SESSION_TTL_DAYS = 30;
const MAGIC_LINK_TTL_MIN = 15;
const COOKIE_NAME = "diletta_session";

export const SESSION_COOKIE_NAME = COOKIE_NAME;

const enc = new TextEncoder();
const dec = new TextDecoder();

function getAllowedEmails(): string[] {
  return (process.env.ALLOWED_EMAILS || "")
    .split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
}
function getAllowedDomains(): string[] {
  return (process.env.ALLOWED_DOMAINS || "dilettasolutions.com")
    .split(",").map((d) => d.trim().toLowerCase()).filter(Boolean);
}

export function isEmailAllowed(email: string): boolean {
  const e = (email || "").trim().toLowerCase();
  if (!e || !e.includes("@")) return false;
  if (getAllowedEmails().includes(e)) return true;
  const domain = e.split("@")[1];
  return getAllowedDomains().includes(domain);
}

// --- base64url helpers (no Buffer dependency) -------------------------------

function b64urlEncodeBytes(bytes: Uint8Array): string {
  let s = "";
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function b64urlDecodeBytes(s: string): Uint8Array {
  s = s.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
function jsonB64Encode(obj: unknown): string {
  return b64urlEncodeBytes(enc.encode(JSON.stringify(obj)));
}
function jsonB64Decode<T>(s: string): T | null {
  try {
    return JSON.parse(dec.decode(b64urlDecodeBytes(s))) as T;
  } catch {
    return null;
  }
}

// --- HMAC SHA-256 via Web Crypto --------------------------------------------

async function getKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    enc.encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
}

async function hmac(payload: string): Promise<string> {
  const key = await getKey();
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return b64urlEncodeBytes(new Uint8Array(sig));
}

function safeEq(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

function randomNonce(): string {
  const arr = new Uint8Array(8);
  crypto.getRandomValues(arr);
  return b64urlEncodeBytes(arr);
}

// --- magic link tokens ------------------------------------------------------

type MagicPayload = { email: string; exp: number; nonce: string };

export async function createMagicToken(email: string): Promise<string> {
  const payload: MagicPayload = {
    email: email.toLowerCase(),
    exp: Date.now() + MAGIC_LINK_TTL_MIN * 60 * 1000,
    nonce: randomNonce(),
  };
  const body = jsonB64Encode(payload);
  const sig = await hmac(`magic.${body}`);
  return `${body}.${sig}`;
}

export async function verifyMagicToken(token: string): Promise<{ email: string } | null> {
  const [body, sig] = (token || "").split(".");
  if (!body || !sig) return null;
  const expected = await hmac(`magic.${body}`);
  if (!safeEq(sig, expected)) return null;
  const payload = jsonB64Decode<MagicPayload>(body);
  if (!payload) return null;
  if (Date.now() > payload.exp) return null;
  if (!isEmailAllowed(payload.email)) return null;
  return { email: payload.email };
}

// --- session cookie value (signing/verification) ----------------------------

type SessionPayload = { email: string; exp: number };

export async function createSessionValue(email: string): Promise<string> {
  const payload: SessionPayload = {
    email: email.toLowerCase(),
    exp: Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000,
  };
  const body = jsonB64Encode(payload);
  const sig = await hmac(`session.${body}`);
  return `${body}.${sig}`;
}

export async function verifySessionValue(value: string): Promise<{ email: string } | null> {
  const [body, sig] = (value || "").split(".");
  if (!body || !sig) return null;
  const expected = await hmac(`session.${body}`);
  if (!safeEq(sig, expected)) return null;
  const payload = jsonB64Decode<SessionPayload>(body);
  if (!payload) return null;
  if (Date.now() > payload.exp) return null;
  if (!isEmailAllowed(payload.email)) return null;
  return { email: payload.email };
}

export const SESSION_TTL_SECONDS = SESSION_TTL_DAYS * 24 * 60 * 60;
