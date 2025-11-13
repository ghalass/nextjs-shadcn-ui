import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// import { verifyJwt } from "@/lib/jwt"; // doit renvoyer le payload du token (user)
import { getSession } from "./lib/auth";

const routePermissions: Record<string, string[]> = {
  "/api/users": ["USER", "ADMIN", "SUPER_ADMIN"],
  "/api/sites": ["USER", "ADMIN", "SUPER_ADMIN"],
};

export async function proxy(req: NextRequest) {
  // const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;
  const isApi = pathname.startsWith("/api/");
  const session = await getSession();

  const publicPaths = [
    // "/",
    // "/about",
    "/login",
    "/register",
    "/api/users",
    "/api/auth/login",
    "/api/auth/register",
    "/api/auth/logout",
    "/api/auth/me",
  ];

  // 🔓 Routes publiques
  if (
    publicPaths.some(
      (path) => pathname === path || pathname.startsWith(path + "/")
    )
  ) {
    if (
      session.isLoggedIn &&
      (pathname === "/login" || pathname === "/register")
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    // if (
    //   token &&
    //   verifyJwt(token) &&
    //   (pathname === "/login" || pathname === "/register")
    // ) {
    //   return NextResponse.redirect(new URL("/", req.url));
    // }

    return NextResponse.next();
  }

  // 🔒 Routes privées
  // const decoded = token ? verifyJwt(token) : null;

  const decoded = session.isLoggedIn ? session : null;

  if (!decoded) {
    if (isApi) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    } else {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // ✅ Récupère le rôle utilisateur depuis le token
  const userRole = decoded.role; // <--- ICI c’est ton "user"

  // 🔒 Vérifie les permissions pour les routes API
  if (isApi) {
    // Match aussi les sous-routes (ex: /api/users/123)
    const allowedRoles = Object.entries(routePermissions).find(([path]) =>
      pathname.startsWith(path)
    )?.[1];

    if (allowedRoles && !allowedRoles.includes(userRole)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
