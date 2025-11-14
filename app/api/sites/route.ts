// app/api/sites/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { protectReadRoute } from "@/lib/rbac/middleware";

export async function GET(request: NextRequest) {
  try {
    // Vérifier la permission de lecture des utilisateurs
    const protectionError = await protectReadRoute(request, "users");
    if (protectionError) return protectionError;

    const sites = await prisma.site.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(sites);
  } catch (error) {
    console.error("Error fetching sites:", error);
    return NextResponse.json(
      { message: "Erreur lors de la récupération des sites" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, active = true } = body;

    const site = await prisma.site.create({
      data: {
        name,
        active,
      },
    });

    return NextResponse.json(site, { status: 201 });
  } catch (error) {
    console.error("Error creating site:", error);

    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        { message: "Un site avec ce nom existe déjà" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Erreur lors de la création du site" },
      { status: 500 }
    );
  }
}
