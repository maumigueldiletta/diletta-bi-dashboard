import { NextRequest, NextResponse } from "next/server";
import { createMagicToken, isEmailAllowed } from "@/lib/auth";
import { sendMagicLinkEmail } from "@/lib/email";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { email } = await req.json().catch(() => ({ email: "" }));
  const e = (email || "").trim().toLowerCase();
  // Sempre retornamos 200 pra não revelar quem está no allowlist
  if (!e || !e.includes("@")) {
    return NextResponse.json({ ok: true });
  }
  if (!isEmailAllowed(e)) {
    return NextResponse.json({ ok: true });
  }
  const token = createMagicToken(e);
  const url = `${baseUrl(req)}/api/auth/verify?token=${encodeURIComponent(token)}`;
  const result = await sendMagicLinkEmail(e, url);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

function baseUrl(req: NextRequest): string {
  const env = process.env.NEXTAUTH_URL || process.env.APP_URL;
  if (env) return env.replace(/\/$/, "");
  return new URL(req.url).origin;
}
