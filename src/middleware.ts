import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

/**
 * Gate everything under /admin except the login screen.
 *
 * This only checks that the session cookie is a validly signed, unexpired JWT —
 * it runs on the edge runtime and cannot reach the database. Server actions and
 * admin pages still call `requireSession()` for the authoritative check.
 */
export async function middleware(request: NextRequest) {
  const token = request.cookies.get("bm_session")?.value;
  const secret = process.env.AUTH_SECRET;

  let valid = false;
  if (token && secret && secret.length >= 16) {
    try {
      await jwtVerify(token, new TextEncoder().encode(secret));
      valid = true;
    } catch {
      valid = false;
    }
  }

  const { pathname, search } = request.nextUrl;
  const isLogin = pathname === "/admin/login";

  if (!valid && !isLogin) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = pathname === "/admin" ? "" : `?next=${pathname}${search}`;
    return NextResponse.redirect(url);
  }

  if (valid && isLogin) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/((?!login).*)", "/admin/login"],
};
