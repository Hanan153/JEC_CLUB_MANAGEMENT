import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdmin = token?.role === "ADMIN";
    const isCoordinator = token?.role === "COORDINATOR";
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
    const isCoordinatorRoute = req.nextUrl.pathname.startsWith("/coordinator");

    if (isAdminRoute && !isAdmin) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (isCoordinatorRoute && !isCoordinator) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/profile/:path*",
    "/clubs/:path*",
    "/events/:path*",
  ],
}; 