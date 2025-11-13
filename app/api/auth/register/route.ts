// app/api/auth/register/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
// import { signJwt } from "@/lib/jwt";
import { getSession, hashPassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Un utilisateur avec cet email existe déjà" },
        { status: 400 }
      );
    }

    // Générer un salt et hasher le mot de passe
    const hashed = await hashPassword(password);

    const user = await prisma.user.create({
      // data: { name, email, password: hashedPassword, salt },
      data: { name, email, password: hashed.hash, salt: hashed.salt },
    });

    // // Génération du token JWT
    // const token = signJwt({
    //   userId: user.id,
    //   email: user.email,
    //   role: user.role,
    // });

    const response = NextResponse.json({
      message: "Utilisateur créé avec succès",
      user: { id: user.id, email: user.email },
    });

    const session = await getSession();
    session.userId = user.id;
    session.email = user.email;
    session.role = user.role;
    session.isLoggedIn = true;
    await session.save();

    // response.cookies.set("token", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "strict",
    //   path: "/",
    //   maxAge: 7 * 24 * 60 * 60,
    // });

    return response;
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
