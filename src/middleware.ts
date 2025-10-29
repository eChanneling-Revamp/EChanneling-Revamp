import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      const path = req.nextUrl.pathname;

      if (!token) return false; // not logged in

      // API role-based protection
      if (path.startsWith("/api/admin") && token.role !== "admin") return false;
      if (path.startsWith("/api/doctor") && token.role !== "doctor")
        return false;
      if (path.startsWith("/api/hospital") && !["admin", "hospital"].includes(token.role as string))
        return false;
      if (path.startsWith("/api/user") && token.role !== "user") return false;
      if (path.startsWith("/api/telecomagent") && token.role !== "telecomagent")
        return false;

      return true;
    },
  },
});

export const config = {
  matcher: [
    "/api/admin/:path*",
    "/api/doctor/:path*",
    "/api/hospital/:path*",
    "/api/user/:path*",
    "/api/telecomagent/:path*",
  ],
};
