import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PanneCreateDto } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const enginId = searchParams.get("enginId");
    const typepanneId = searchParams.get("typepanneId");
    const niveauUrgenceId = searchParams.get("niveauUrgenceId");
    const siteId = searchParams.get("siteId");
    const statut = searchParams.get("statut");

    const where: any = {};

    if (search) {
      where.OR = [
        { code: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { observations: { contains: search, mode: "insensitive" } },
      ];
    }

    if (enginId) where.enginId = enginId;
    if (typepanneId) where.typepanneId = typepanneId;
    if (niveauUrgenceId) where.niveauUrgenceId = niveauUrgenceId;
    if (siteId) where.engin = { siteId };

    if (statut) {
      switch (statut) {
        case "en-attente":
          where.dateExecution = null;
          where.dateCloture = null;
          break;
        case "en-cours":
          where.dateExecution = { not: null };
          where.dateCloture = null;
          break;
        case "resolue":
          where.dateCloture = { not: null };
          break;
      }
    }

    const pannes = await prisma.panne.findMany({
      where,
      include: {
        typepanne: true,
        originePanne: true,
        niveauUrgence: true,
        engin: {
          include: {
            site: true,
            parc: true,
          },
        },
        interventions: {
          include: {
            technicien: true,
            statutIntervention: true,
          },
        },
        piecesDemandees: {
          include: {
            piece: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(pannes);
  } catch (error) {
    console.error("Erreur lors du chargement des pannes:", error);
    return NextResponse.json(
      { error: "Erreur lors du chargement des pannes" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: PanneCreateDto = await request.json();

    // Générer un code unique pour la panne
    const lastPanne = await prisma.panne.findFirst({
      orderBy: { createdAt: "desc" },
    });

    const nextCode = lastPanne?.code
      ? `PAN-${String(parseInt(lastPanne.code.split("-")[1]) + 1).padStart(
          4,
          "0"
        )}`
      : "PAN-0001";

    const panne = await prisma.panne.create({
      data: {
        code: nextCode,
        description: body.description,
        dateApparition: new Date(body.dateApparition),
        dateExecution: body.dateExecution ? new Date(body.dateExecution) : null,
        dateCloture: body.dateCloture ? new Date(body.dateCloture) : null,
        observations: body.observations,
        tempsArret: body.tempsArret,
        coutEstime: body.coutEstime,
        typepanneId: body.typepanneId,
        originePanneId: body.originePanneId,
        niveauUrgenceId: body.niveauUrgenceId,
        enginId: body.enginId,
      },
      include: {
        typepanne: true,
        originePanne: true,
        niveauUrgence: true,
        engin: {
          include: {
            site: true,
            parc: true,
          },
        },
      },
    });

    return NextResponse.json(panne, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création de la panne:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la panne" },
      { status: 500 }
    );
  }
}
