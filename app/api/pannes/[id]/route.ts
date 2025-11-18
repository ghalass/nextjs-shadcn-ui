import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PanneUpdateDto } from "@/lib/types";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const panne = await prisma.panne.findUnique({
      where: { id: params.id },
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
            piecesUtilisees: {
              include: {
                piece: true,
              },
            },
          },
        },
        piecesDemandees: {
          include: {
            piece: true,
          },
        },
        saisiehims: true,
      },
    });

    if (!panne) {
      return NextResponse.json({ error: "Panne non trouvée" }, { status: 404 });
    }

    return NextResponse.json(panne);
  } catch (error) {
    console.error("Erreur lors du chargement de la panne:", error);
    return NextResponse.json(
      { error: "Erreur lors du chargement de la panne" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body: PanneUpdateDto = await request.json();

    const panne = await prisma.panne.update({
      where: { id: params.id },
      data: {
        description: body.description,
        dateApparition: body.dateApparition
          ? new Date(body.dateApparition)
          : undefined,
        dateExecution: body.dateExecution
          ? new Date(body.dateExecution)
          : undefined,
        dateCloture: body.dateCloture ? new Date(body.dateCloture) : undefined,
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

    return NextResponse.json(panne);
  } catch (error) {
    console.error("Erreur lors de la modification de la panne:", error);
    return NextResponse.json(
      { error: "Erreur lors de la modification de la panne" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.panne.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Panne supprimée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de la panne:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de la panne" },
      { status: 500 }
    );
  }
}
