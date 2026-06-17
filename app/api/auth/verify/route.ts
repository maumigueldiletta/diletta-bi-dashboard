import { NextRequest, NextResponse } from "next/server";
import { verifyMagicToken } from "@/lib/auth";
import { setSessionCookie } from "@/lib/auth-server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") || "";
  const result = await verifyMagicToken(token);
  if (!result) {
    return NextResponse.redirect(new URL("/login?error=invalid_link", req.url));
  }
  await setSessionCookie(result.email);
  return NextResponse.redirect(new URL("/", req.url));
}
