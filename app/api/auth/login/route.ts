// app/api/auth/login/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, verifyPassword } from "@/lib/auth";
import yup from "@/lib/yupFr";

// Schéma de validation Yup pour la connexion
const loginSchema = yup.object({
  email: yup.string().email().required().label("Email"),
  password: yup.string().min(6).required().label("Mot de passe"),
});

export async function POST(req: NextRequest) {
  try {
    // Lire le corps de la requête
    const body = await req.text();

    // Vérifier si le corps n'est pas vide
    if (!body) {
      return NextResponse.json(
        { error: "Le corps de la requête ne doit pas être vide" },
        { status: 400 }
      );
    }

    let parsedBody;
    try {
      parsedBody = JSON.parse(body);
    } catch (parseError) {
      return NextResponse.json({ error: "JSON mal formé" }, { status: 400 });
    }

    // Validation avec Yup
    try {
      await loginSchema.validate(parsedBody, { abortEarly: false });
    } catch (validationError: any) {
      return NextResponse.json(
        {
          error: "Erreur de validation",
          details: validationError.errors,
        },
        { status: 400 }
      );
    }

    const { email, password } = parsedBody;

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        roles: {
          include: {
            role: true,
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

    const session = await getSession();
    session.userId = user.id;
    session.email = user.email;
    session.roles = user.roles.map((r) => r.role.name);
    session.isLoggedIn = true;
    await session.save();

    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      user: userWithoutPassword,
      status: 200,
    });
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
