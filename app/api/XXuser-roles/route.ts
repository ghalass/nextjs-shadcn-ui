import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { protectCreateRoute, protectReadRoute } from "@/lib/rbac/middleware";

const resource = "roles";

// Lister les liaisons user-role
export async function GET(request: NextRequest) {
  const protectionError = await protectReadRoute(request, resource);
  if (protectionError) return protectionError;

  const list = await prisma.userRole.findMany({
    include: { user: true, role: true },
  });
  return NextResponse.json(list);
}

// Créer une liaison user-role
export async function POST(request: NextRequest) {
  const protectionError = await protectCreateRoute(request, resource);
  if (protectionError) return protectionError;

  const { userId, roleId } = await request.json();
  const link = await prisma.userRole.create({ data: { userId, roleId } });
  return NextResponse.json(link, { status: 201 });
}
