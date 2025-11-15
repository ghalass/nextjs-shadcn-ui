import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const permissions = await prisma.permission.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        resource: true, // Inclure les données de la ressource
      },
    });

    return NextResponse.json(permissions);
  } catch (error) {
    console.error("❌ Error fetching permissions:", error);
    return NextResponse.json(
      { message: "Erreur lors de la récupération des permissions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, resourceId, action, description } = body;

    // Validation des données
    if (!name || !resourceId || !action) {
      return NextResponse.json(
        { message: "Le nom, la ressource et l'action sont requis" },
        { status: 400 }
      );
    }

    // ✅ CORRECTION : Utiliser resourceId directement
    const permission = await prisma.permission.create({
      data: {
        name,
        resourceId,
        action,
        description,
      },
      include: {
        resource: true, // Inclure la ressource dans la réponse
      },
    });

    console.log("✅ Permission created successfully:", permission.id);
    return NextResponse.json(permission, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating permission:", error);

    if (error instanceof Error) {
      if (error.message.includes("Unique constraint")) {
        if (error.message.includes("name")) {
          return NextResponse.json(
            { message: "Une permission avec ce nom existe déjà" },
            { status: 400 }
          );
        }
        if (error.message.includes("resource_action")) {
          return NextResponse.json(
            {
              message:
                "Une permission avec cette combinaison ressource/action existe déjà",
            },
            { status: 400 }
          );
        }
      }

      // ✅ Gestion spécifique de l'erreur de clé étrangère
      if (error.message.includes("Foreign key constraint")) {
        return NextResponse.json(
          { message: "La ressource spécifiée n'existe pas" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { message: "Erreur lors de la création de la permission" },
      { status: 500 }
    );
  }
}
