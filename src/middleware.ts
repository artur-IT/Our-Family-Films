import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ROUTES = {
  ADMIN: "/admin",
  USER: "/user",
  AUTH: "/auth",
} as const;

// This function handles the middleware logic for authentication
export function middleware(request: NextRequest) {
  // Retrieve the 'auth' cookie from the request
  const authCookie = request.cookies.get("auth");

  // Check if the user is logged in by verifying the 'auth' cookie
  // If the cookie is missing or its value is not "true", redirect to the authentication page
  if (!authCookie || authCookie.value !== "true") {
    return NextResponse.redirect(new URL(ROUTES.AUTH, request.url));
  }

  // If the user is accessing the home page or user/admin routes
  // Set the 'auth' cookie to "false" to indicate the user is not logged in anymore
  if (request.nextUrl.pathname === "/" || request.nextUrl.pathname === ROUTES.USER || request.nextUrl.pathname === ROUTES.ADMIN) {
    const response = NextResponse.next();
    response.cookies.set("auth", "false");
    return response;
  }

  // If the user is trying to access admin or user routes
  // Check again if the user is logged in; if not, redirect to the authentication page
  if (request.nextUrl.pathname.startsWith(ROUTES.ADMIN) || request.nextUrl.pathname.startsWith(ROUTES.USER)) {
    if (!authCookie || authCookie.value !== "true") {
      return NextResponse.redirect(new URL(ROUTES.AUTH, request.url));
    }
  }

  // If all checks pass, allow the request to proceed
  return NextResponse.next();
}

// Configuration for the middleware to match specific routes
export const config = {
  matcher: ["/admin/:path*", "/user/:path*"],
};
