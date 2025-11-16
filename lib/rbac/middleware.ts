// lib/rbac/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { hasPermission, hasRole } from "./core";
import { getSession } from "../auth";

export async function protectRoute(
  request: NextRequest,
  action: string,
  resource: string
): Promise<NextResponse | null> {
  try {
    // Vérifier si l'utilisateur est admin ou super-admin
    const session = await getSession();
    const userId = session?.userId;
    const isAdmin = await hasRole(userId, "admin");
    const isSuperAdmin = await hasRole(userId, "super-admin");
    const isAdminOrSuperAdmin = isAdmin || isSuperAdmin;

    // Accès automatique pour les administrateurs et super-administrateurs
    if (isAdminOrSuperAdmin) {
      return null; // Accès autorisé pour les administrateurs
    }

    // Vérifier l'authentification de l'utilisateur, si ce n'est pas un admin ou super-admin
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Utilisateur non authentifié" },
        { status: 401 }
      );
    }

    // Vérifier les permissions spécifiques, si ce n'est pas un admin ou super-admin
    const hasAccess = await hasPermission(userId, action, resource);

    if (!hasAccess) {
      return NextResponse.json(
        { message: "Opération non autorisée" },
        { status: 403 }
      );
    }

    return null;
  } catch (error) {
    console.error("Error in protectRoute:", error);
    return NextResponse.json(
      { message: "Erreur de vérification des permissions" },
      { status: 500 }
    );
  }
}

export async function protectReadRoute(
  request: NextRequest,
  resource: string
): Promise<NextResponse | null> {
  return protectRoute(request, "read", resource);
}

export async function protectWriteRoute(
  request: NextRequest,
  resource: string
): Promise<NextResponse | null> {
  return protectRoute(request, "write", resource);
}

export async function protectCreateRoute(
  request: NextRequest,
  resource: string
): Promise<NextResponse | null> {
  return protectRoute(request, "create", resource);
}

export async function protectUpdateRoute(
  request: NextRequest,
  resource: string
): Promise<NextResponse | null> {
  return protectRoute(request, "update", resource);
}

export async function protectDeleteRoute(
  request: NextRequest,
  resource: string
): Promise<NextResponse | null> {
  return protectRoute(request, "delete", resource);
}
