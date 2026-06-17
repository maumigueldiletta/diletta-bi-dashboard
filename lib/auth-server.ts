// Node-only cookie helpers (do NOT import in middleware)
import { cookies } from "next/headers";
import { createSessionValue, SESSION_COOKIE_NAME, SESSION_TTL_SECONDS, verifySessionValue } from "./auth";

export async function setSessionCookie(email: string) {
  const c = await cookies();
  const value = await createSessionValue(email);
  c.set(SESSION_COOKIE_NAME, value, {
    httpOnly: true, secure: true, sameSite: "lax", path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function clearSessionCookie() {
  const c = await cookies();
  c.set(SESSION_COOKIE_NAME, "", { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 0 });
}

export async function getCurrentSession(): Promise<{ email: string } | null> {
  const c = await cookies();
  const v = c.get(SESSION_COOKIE_NAME)?.value;
  if (!v) return null;
  return verifySessionValue(v);
}
