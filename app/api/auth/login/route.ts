// app/api/auth/login/route.ts

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signJwt } from "@/lib/jwt";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json(
        { error: "Email ou mot de passe incorrect!" },
        { status: 401 }
      );
    }

    // 🔹 Vérifier le mot de passe avec le salt
    const passwordMatches = await bcrypt.compare(
      password + user.salt,
      user.password
    );

    if (!passwordMatches) {
      return NextResponse.json(
        { error: "Email ou mot de passe incorrect!" },
        { status: 401 }
      );
    }

    // 🔹 Génération du JWT
    const token = signJwt({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json({ message: "Logged in" });
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 jours
    });

    return response;
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
