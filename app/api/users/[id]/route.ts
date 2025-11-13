import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    // Get id from URL (/api/v1/users/:id)
    const { pathname } = new URL(req.url);
    // Ex: /api/v1/users/123
    const pathParts = pathname.split("/");
    const id = pathParts[pathParts.length - 1];
    // Accept data in body for updates
    const { email, name, password, role } = await req.json();
    if (!id || !email || !name) {
      return NextResponse.json(
        { error: "Id, Email, name sont requis" },
        { status: 400 }
      );
    }
    // Vérifier si l'email est déjà utilisé par un autre utilisateur que celui en cours de modification
    const existingUserEmail = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUserEmail && existingUserEmail.id !== id) {
      return NextResponse.json(
        { error: "Cet email est déjà utilisé par un autre utilisateur." },
        { status: 409 }
      );
    }
    let pwd = existingUserEmail?.password;
    if (password.trim() !== "") pwd = password;

    const user = await prisma.user.update({
      where: { id },
      data: { email, name, password: pwd, role },
    });
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update user" },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Get id from URL (/api/v1/users/:id)
    const { pathname } = new URL(req.url);
    const pathParts = pathname.split("/");
    const id = pathParts[pathParts.length - 1];
    if (!id) {
      return NextResponse.json({ error: "Id requis" }, { status: 400 });
    }

    const user = await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
