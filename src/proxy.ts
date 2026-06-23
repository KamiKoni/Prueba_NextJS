import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { ACCESS_COOKIE_NAME, REFRESH_COOKIE_NAME } from "@/lib/constants";

export function proxy(request: NextRequest) {
  const hasSession =
    request.cookies.has(ACCESS_COOKIE_NAME) || request.cookies.has(REFRESH_COOKIE_NAME);
  const { pathname } = request.nextUrl;

  if ((pathname.startsWith("/dashboard") || pathname.startsWith("/favorites")) && !hasSession) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/favorites/:path*"],
};
