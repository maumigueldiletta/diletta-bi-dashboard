import { NextRequest, NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth-server";

export const runtime = "nodejs";

async function go(req: NextRequest) {
  await clearSessionCookie();
  return NextResponse.redirect(new URL("/login", req.url));
}
export const GET = go;
export const POST = go;
