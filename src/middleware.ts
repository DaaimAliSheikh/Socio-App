import { NextResponse } from "next/server";
import authConfig from "./auth.config";
import NextAuth from "next-auth";
const { auth } = NextAuth(authConfig);
export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = req.auth;
  const isApiAuth = nextUrl.pathname.startsWith("/api/auth");
  const isAuth = nextUrl.pathname == "/about";
  const isPublic = nextUrl.pathname == "/";

  if (isApiAuth) return; //return passes control

  if (isAuth) {
    if (isLoggedIn) return NextResponse.redirect(new URL("/profile", nextUrl));
    return;
  }

  if (!isLoggedIn && !isPublic)
    return NextResponse.redirect(new URL("/about", nextUrl));

  return; // all ok
});
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
