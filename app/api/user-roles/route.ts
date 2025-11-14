import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Lister les liaisons user-role
export async function GET() {
  const list = await prisma.userRole.findMany({
    include: { user: true, role: true },
  });
  return NextResponse.json(list);
}

// Créer une liaison user-role
export async function POST(request: NextRequest) {
  const { userId, roleId } = await request.json();
  const link = await prisma.userRole.create({ data: { userId, roleId } });
  return NextResponse.json(link, { status: 201 });
}
