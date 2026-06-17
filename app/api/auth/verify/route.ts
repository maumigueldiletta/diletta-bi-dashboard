import { NextRequest, NextResponse } from "next/server";
import { verifyMagicToken, setSessionCookie } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") || "";
  const result = verifyMagicToken(token);
  if (!result) {
    return NextResponse.redirect(new URL("/login?error=invalid_link", req.url));
  }
  await setSessionCookie(result.email);
  return NextResponse.redirect(new URL("/", req.url));
}
