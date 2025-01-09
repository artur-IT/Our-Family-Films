import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

//  middleware do ochrony panelu admina

export function middleware(request: NextRequest) {
  // Na początek prosta weryfikacja - później rozbudujemy o pełną autoryzację
  // const authCookie = request.cookies.get("auth");

  if (request.nextUrl.pathname === "/") {
    const response = NextResponse.next();
    response.cookies.set("auth", "false");
    return response;
  }

  if (request.nextUrl.pathname.startsWith("/admin") || request.nextUrl.pathname.startsWith("/user")) {
    const authCookie = request.cookies.get("auth");
    if (!authCookie || authCookie.value !== "true") {
      return NextResponse.redirect(new URL("/auth", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*", "/"],
};
