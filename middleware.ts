import { NextRequest, NextResponse } from "next/server";
import { verifySessionValue, SESSION_COOKIE_NAME } from "@/lib/auth";

const DISABLE_AUTH = process.env.DISABLE_AUTH === "1";
const PUBLIC = ["/login", "/api/auth"];

export async function middleware(req: NextRequest) {
  if (DISABLE_AUTH) return NextResponse.next();

  const { pathname } = req.nextUrl;
  if (PUBLIC.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const cookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = cookie ? await verifySessionValue(cookie) : null;
  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$).*)"],
};
