import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const accessCookie = "clockhub_access";
const refreshCookie = "clockhub_refresh";

export function proxy(request: NextRequest) {
  const hasSession =
    request.cookies.has(accessCookie) || request.cookies.has(refreshCookie);
  const { pathname } = request.nextUrl;

  if ((pathname.startsWith("/dashboard") || pathname.startsWith("/favorites")) && !hasSession) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if ((pathname.startsWith("/auth/login") || pathname.startsWith("/auth/register")) && hasSession) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/favorites/:path*", "/auth/login", "/auth/register"],
};
