import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

//  middleware do ochrony panelu admina

export function middleware(request: NextRequest) {
  // Na początek prosta weryfikacja - później rozbudujemy o pełną autoryzację
  const isAuthenticated = request.cookies.get("auth");

  if (!isAuthenticated && request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
