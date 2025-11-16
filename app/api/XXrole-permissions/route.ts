import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const list = await prisma.rolePermission.findMany({
    include: { role: true, permission: true },
  });
  return NextResponse.json(list);
}

export async function POST(request: NextRequest) {
  const { roleId, permissionId } = await request.json();
  const link = await prisma.rolePermission.create({
    data: { roleId, permissionId },
  });
  return NextResponse.json(link, { status: 201 });
}
