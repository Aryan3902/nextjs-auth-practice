import { NextResponse, NextRequest } from "next/server";

const protectedRoutes = ["/dashboard"];
const authRoutes = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const currentUserCookie = request.cookies.get("user")?.value;
  const currentUser = currentUserCookie ? JSON.parse(currentUserCookie) : null;
  console.log(currentUser);
  if (
    protectedRoutes.includes(request.nextUrl.pathname) &&
    (!currentUser || Date.now() > currentUser.expiresAt)
  ) {
    request.cookies.delete("user");
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("user");

    return response;
  }

  if (authRoutes.includes(request.nextUrl.pathname) && currentUser) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
}
