import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { permissionId: string; roleId: string } }
) {
  const { permissionId, roleId } = await params; // 🔹 attention : await pour App Router

  try {
    await prisma.rolePermission.create({
      data: {
        permission: { connect: { id: permissionId } },
        role: { connect: { id: roleId } },
      },
    });
    return NextResponse.json({ message: "Role assigned to permission" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Impossible d'assigner le rôle" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { permissionId: string; roleId: string } }
) {
  const { permissionId, roleId } = await params; // 🔹 await ici aussi

  try {
    await prisma.rolePermission.deleteMany({
      where: {
        permissionId,
        roleId,
      },
    });
    return NextResponse.json({ message: "Role removed from permission" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Impossible de retirer le rôle" },
      { status: 400 }
    );
  }
}
