// lib/rbac/middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { hasPermission } from "@/lib/rbac/core";
import { getSession } from "../auth";

/**
 * Middleware pour protéger les routes API avec RBAC
 */
export async function protectRoute(
  request: NextRequest,
  action: string,
  resource: string
): Promise<NextResponse | null> {
  // const userId = request.headers.get("x-user-id");

  const session = await getSession();
  const userId = session?.userId;

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized", message: "Utilisateur non authentifié" },
      { status: 401 }
    );
  }

  const hasAccess = await hasPermission(userId, action, resource);

  if (!hasAccess) {
    console.warn(
      `Accès refusé: ${userId} tente d'accéder à ${action}:${resource}`
    );
    return NextResponse.json(
      {
        error: "Forbidden",
        message: `Vous n'avez pas la permission ${action} sur ${resource}`,
      },
      { status: 403 }
    );
  }

  return null; // Accès autorisé
}

/**
 * Middleware pour les opérations de lecture
 */
export async function protectReadRoute(request: NextRequest, resource: string) {
  return protectRoute(request, "read", resource);
}

/**
 * Middleware pour les opérations de création
 */
export async function protectCreateRoute(
  request: NextRequest,
  resource: string
) {
  return protectRoute(request, "create", resource);
}

/**
 * Middleware pour les opérations de modification
 */
export async function protectUpdateRoute(
  request: NextRequest,
  resource: string
) {
  return protectRoute(request, "update", resource);
}

/**
 * Middleware pour les opérations de suppression
 */
export async function protectDeleteRoute(
  request: NextRequest,
  resource: string
) {
  return protectRoute(request, "delete", resource);
}

/**
 * Middleware pour les opérations de gestion complète
 */
export async function protectManageRoute(
  request: NextRequest,
  resource: string
) {
  return protectRoute(request, "manage", resource);
}
