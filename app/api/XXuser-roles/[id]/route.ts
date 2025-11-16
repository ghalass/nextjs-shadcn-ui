import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { protectDeleteRoute } from "@/lib/rbac/middleware";

const resource = "roles";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const protectionError = await protectDeleteRoute(request, resource);
  if (protectionError) return protectionError;

  await prisma.userRole.delete({ where: { id: params.id } });
  return NextResponse.json({ message: "UserRole deleted" });
}
