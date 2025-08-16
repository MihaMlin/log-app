import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/dashboard", "/dashboard/:path*"];
const publicRoutes = [
  "/",
  "/sign-in",
  "/password/set",
  "/password/set/:path*",
  "/password/reset",
  "/password/forgot",
];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const accessToken = req.cookies.get("accessToken")?.value;

  const isProtectedRoute = protectedRoutes.some((route) => {
    if (route.endsWith(":path*")) {
      return path.startsWith(route.replace(":path*", ""));
    }
    return path === route;
  });

  const isPublicRoute = publicRoutes.some((route) => {
    if (route.endsWith(":path*")) {
      return path.startsWith(route.replace(":path*", ""));
    }
    return path === route;
  });

  // PROTECTED ROUTES
  // If we dont have an access token
  // 1. we will get 401 Unauthorized
  // 2. we will send request to /api/auth/refresh with refresh token
  // 3. if refresh token is valid, we will get new access token
  // 4. if refresh token is invalid, we will redirect to /sign-in (API interceptor handles this)

  if (isPublicRoute && accessToken) {
    return NextResponse.rewrite(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
}
