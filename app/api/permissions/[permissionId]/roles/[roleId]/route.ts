// app/api/permissions/[permissionId]/roles/[roleId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import {
  assignPermissionToRole,
  removePermissionFromRole,
} from "@/lib/rbac/core";
import { protectManageRoute } from "@/lib/rbac/middleware";

export async function POST(
  req: NextRequest,
  { params }: { params: { permissionId: string; roleId: string } }
) {
  // 🔒 Vérifier les permissions
  const protectionError = await protectManageRoute(req, "permissions");
  if (protectionError) return protectionError;

  const { permissionId, roleId } = await params;

  try {
    await assignPermissionToRole(roleId, permissionId);

    return NextResponse.json({
      message: "Permission assignée au rôle avec succès",
    });
  } catch (err) {
    console.error(err);

    if (err instanceof Error && err.message.includes("Unique constraint")) {
      return NextResponse.json(
        { error: "Cette permission est déjà assignée à ce rôle" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Impossible d'assigner la permission au rôle" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { permissionId: string; roleId: string } }
) {
  // 🔒 Vérifier les permissions
  const protectionError = await protectManageRoute(req, "permissions");
  if (protectionError) return protectionError;

  const { permissionId, roleId } = await params;

  try {
    await removePermissionFromRole(roleId, permissionId);

    return NextResponse.json({
      message: "Permission retirée du rôle avec succès",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Impossible de retirer la permission du rôle" },
      { status: 500 }
    );
  }
}
