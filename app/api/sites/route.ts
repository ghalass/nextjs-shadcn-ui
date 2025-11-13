import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const DELAY = 2000;

// ✅ GET /api/sites — récupérer tous les sites actifs
export async function GET() {
  try {
    // ✅ Simuler un délai de 2 secondes
    await new Promise((resolve) => setTimeout(resolve, DELAY));

    const sites = await prisma.site.findMany({
      where: { active: true },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(sites);
  } catch (error) {
    return NextResponse.json(
      { error: "Impossible de fetch les sites" },
      { status: 500 }
    );
  }
}

// ✅ POST /api/sites — créer un nouveau site
export async function POST(req: Request) {
  try {
    // ✅ Simuler un délai de 2 secondes
    await new Promise((resolve) => setTimeout(resolve, DELAY));

    const body = await req.json();

    const { name, active = true } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Le champ 'name' est requis et doit être une chaîne" },
        { status: 400 }
      );
    }

    const exists = await prisma.site.findFirst({
      where: { name: name },
    });

    if (exists) {
      return NextResponse.json({ error: "Site déjà utilisé" }, { status: 400 });
    }

    const site = await prisma.site.create({
      data: { name, active },
    });

    return NextResponse.json(site, { status: 201 });
  } catch (error) {
    console.error("Erreur création site:", error);
    return NextResponse.json(
      { error: "Impossible de créer le site" },
      { status: 500 }
    );
  }
}
