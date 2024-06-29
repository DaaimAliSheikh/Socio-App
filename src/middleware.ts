import { NextResponse } from "next/server";
import authConfig from "./auth.config";
import NextAuth from "next-auth";

const authRoutes = ["/signin", "/profile"];
const publicRoutes: string[] = [];
const redirectUrl = "/";

const { auth } = NextAuth(authConfig);
export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = req.auth;
  const isApiAuth = nextUrl.pathname.startsWith("/api/auth");
  const isAuth = authRoutes.includes(nextUrl.pathname);
  const isPublic = publicRoutes.includes(nextUrl.pathname);

  if (isApiAuth) return; //return passes control

  if (isAuth) {
    if (isLoggedIn) return NextResponse.redirect(new URL(redirectUrl, nextUrl));
    return;
  }

  if (!isLoggedIn && !isPublic)
    return NextResponse.redirect(new URL("/signin?type=login", nextUrl));

  return; // all ok
});
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
