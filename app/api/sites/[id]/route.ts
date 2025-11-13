// app/api/sites/[id]/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const DELAY = 2000;

// PATCH /api/sites/:id
export async function PATCH(req: Request, context: { params: { id: string } }) {
  try {
    // ✅ Simuler un délai de 2 secondes
    await new Promise((resolve) => setTimeout(resolve, DELAY));

    // Next.js 16 App Router : params doit être "awaited"
    const { id } = await context.params; // <--- important
    const body = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID manquant" }, { status: 400 });
    }

    const exists = await prisma.site.findFirst({
      where: { id: { not: { equals: id } }, name: body.name },
    });

    if (exists) {
      return NextResponse.json({ error: "Site déjà utilisé" }, { status: 400 });
    }

    const updatedSite = await prisma.site.update({
      where: { id },
      data: {
        name: body.name,
        active: body.active,
      },
    });

    return NextResponse.json(updatedSite);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Impossible de mettre à jour le site" },
      { status: 500 }
    );
  }
}

// DELETE /api/sites/:id
export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    // ✅ Simuler un délai de 2 secondes
    await new Promise((resolve) => setTimeout(resolve, DELAY));

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ error: "ID manquant" }, { status: 400 });
    }

    const deletedSite = await prisma.site.delete({
      where: { id },
    });

    return NextResponse.json(deletedSite);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Impossible de supprimer le site" },
      { status: 500 }
    );
  }
}
