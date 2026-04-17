import { NextResponse, type NextRequest } from "next/server";
import { parseSessionCookieValue, SESSION_COOKIE_NAME } from "@/lib/session";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const raw = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = parseSessionCookieValue(raw);

  const isCustomerRoute = pathname.startsWith("/customer");
  const isAdminRoute = pathname.startsWith("/admin");
  const isPosRoute = pathname.startsWith("/pos");
  const isProtected = isCustomerRoute || isAdminRoute || isPosRoute;

  if (isProtected && !session) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (session) {
    if (isCustomerRoute && session.role !== "CUSTOMER") {
      const url = req.nextUrl.clone();
      url.pathname = "/admin";
      url.search = "";
      return NextResponse.redirect(url);
    }
    if ((isAdminRoute || isPosRoute) && session.role === "CUSTOMER") {
      const url = req.nextUrl.clone();
      url.pathname = "/customer";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/customer/:path*", "/admin/:path*", "/pos/:path*"],
};
