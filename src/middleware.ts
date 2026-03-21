import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = [
  "/login",
  "/api/auth",
  "/api/health",
  "/_next",
  "/favicon",
  "/icons",
  "/manifest.json",
  "/sw.js",
];

const OPDS_ROUTES = ["/api/opds"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Laisser passer les routes publiques
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Laisser passer les assets statiques
  if (pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|css|js|woff|woff2)$/)) {
    return NextResponse.next();
  }

  // Routes OPDS : exiger cookie ou Basic Auth header
  if (OPDS_ROUTES.some((route) => pathname.startsWith(route))) {
    const sessionToken = request.cookies.get("kyomu-session")?.value;
    const authHeader = request.headers.get("authorization");
    if (!sessionToken && !authHeader) {
      return new NextResponse("Unauthorized", {
        status: 401,
        headers: { "WWW-Authenticate": 'Basic realm="Kyomu"' },
      });
    }
    return NextResponse.next();
  }

  // Routes normales : vérifier la présence du cookie (pas sa validité)
  const sessionToken = request.cookies.get("kyomu-session")?.value;
  if (!sessionToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
