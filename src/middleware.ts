import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

//  middleware do ochrony panelu admina

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get("auth");

  // Sprawdzenie, czy użytkownik jest zalogowany
  if (!authCookie || authCookie.value !== "true") {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  if (request.nextUrl.pathname === "/" || request.nextUrl.pathname === "/user" || request.nextUrl.pathname === "/admin") {
    const response = NextResponse.next();
    response.cookies.set("auth", "false");
    return response;
  }

  if (request.nextUrl.pathname.startsWith("/admin") || request.nextUrl.pathname.startsWith("/user")) {
    // const authCookie = request.cookies.get("auth");
    if (!authCookie || authCookie.value !== "true") {
      return NextResponse.redirect(new URL("/auth", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*"],
};
