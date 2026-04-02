import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ROUTES = {
  ADMIN: "/admin",
  USER: "/user",
  AUTH: "/auth",
} as const;

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get("auth");

  if (!authCookie || authCookie.value !== "true") {
    return NextResponse.redirect(new URL(ROUTES.AUTH, request.url));
  }

  if (request.nextUrl.pathname === "/" || request.nextUrl.pathname === ROUTES.USER || request.nextUrl.pathname === ROUTES.ADMIN) {
    const response = NextResponse.next();
    response.cookies.set("auth", "false");
    return response;
  }

  if (request.nextUrl.pathname.startsWith(ROUTES.ADMIN) || request.nextUrl.pathname.startsWith(ROUTES.USER)) {
    if (!authCookie || authCookie.value !== "true") {
      return NextResponse.redirect(new URL(ROUTES.AUTH, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*"],
};
