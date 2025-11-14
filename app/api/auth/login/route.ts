// app/api/auth/login/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, verifyPassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        roles: {
          include: {
            role: true, // tu récupères Role.name, Role.id, etc.
          },
        },
      },
    });
    if (!user) {
      return NextResponse.json(
        { error: "Email ou mot de passe incorrect!" },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, user.password);

    if (!isValid) {
      return NextResponse.json(
        { error: "Email ou mot de passe incorrect!" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      user: {
        userId: user.id,
        email: user.email,
        roles: user.roles.map((r) => r.role.name),
        isLoggedIn: true,
      },
      message: "Logged in",
    });

    const session = await getSession();
    session.userId = user.id;
    session.email = user.email;
    // ✅ convertir les rôles pour la session
    session.roles = user.roles.map((r) => r.role.name);
    session.isLoggedIn = true;
    await session.save();

    return response;
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
