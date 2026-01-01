import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token =
    request.cookies.get("authToken")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");

  // Public paths that don't require authentication
  const publicPaths = ["/login", "/signup", "/"];
  if (publicPaths.includes(path)) {
    return NextResponse.next();
  }

  // Allow doctor setup route for authenticated doctor users
  if (path === "/doctor-setup") {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    // Only doctor role users can access setup page
    const userCookie = request.cookies.get("user")?.value;
    if (userCookie) {
      try {
        const userData = JSON.parse(decodeURIComponent(userCookie));
        if (userData.role?.toLowerCase() === "doctor") {
          return NextResponse.next();
        }
      } catch (error) {
        console.error("Error parsing user cookie:", error);
      }
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Allow hospital setup route for authenticated hospital users
  if (path === "/hospital/setup") {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    // Only hospital role users can access setup page
    const userCookie = request.cookies.get("user")?.value;
    if (userCookie) {
      try {
        const userData = JSON.parse(decodeURIComponent(userCookie));
        if (userData.role?.toLowerCase() === "hospital") {
          return NextResponse.next();
        }
      } catch (error) {
        console.error("Error parsing user cookie:", error);
      }
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Check if user is authenticated
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Get user data from cookie
  const userCookie = request.cookies.get("user")?.value;
  let userRole = null;

  if (userCookie) {
    try {
      const userData = JSON.parse(decodeURIComponent(userCookie));
      userRole = userData.role?.toLowerCase();
    } catch (error) {
      console.error("Error parsing user cookie:", error);
    }
  }

  // Role-based access control
  const roleRoutes: Record<string, string[]> = {
    admin: ["/admin"],
    super_admin: ["/admin"],
    doctor: ["/doctor"],
    hospital: ["/hospital"],
    nurse: ["/user"],
    patient: ["/user"],
    user: ["/user"],
  };

  // Check if user has access to the requested path
  if (userRole && roleRoutes[userRole]) {
    const allowedPaths = roleRoutes[userRole];
    const hasAccess = allowedPaths.some((allowedPath) =>
      path.startsWith(allowedPath)
    );

    if (
      !hasAccess &&
      !path.startsWith("/dashboard") &&
      !path.startsWith("/staff")
    ) {
      // Redirect to appropriate dashboard based on role
      const redirectPath = allowedPaths[0] + "/dashboard";
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/doctor/:path*",
    "/doctor-setup",
    "/user/:path*",
    "/hospital/:path*",
    "/staff/:path*",
  ],
};
