import { prisma } from "./prisma";

export async function getUserWithPermissions(userId: string) {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      roles: {
        include: {
          role: {
            include: {
              permissions: {
                include: {
                  permission: true,
                },
              },
            },
          },
        },
      },
    },
  });
}

export async function getUserPermissions(userId: string): Promise<string[]> {
  const user = await getUserWithPermissions(userId);

  if (!user) return [];

  const permissions = new Set<string>();

  user.roles.forEach((userRole) => {
    userRole.role.permissions.forEach((rolePermission) => {
      const perm = rolePermission.permission;
      permissions.add(`${perm.action}:${perm.resource}`);
    });
  });

  return Array.from(permissions);
}

export async function hasPermission(
  userId: string,
  action: string,
  resource: string
): Promise<boolean> {
  const count = await prisma.user.count({
    where: {
      id: userId,
      roles: {
        some: {
          role: {
            permissions: {
              some: {
                permission: {
                  action,
                  resource,
                },
              },
            },
          },
        },
      },
    },
  });

  return count > 0;
}

export async function hasRole(
  userId: string,
  roleName: string
): Promise<boolean> {
  const count = await prisma.user.count({
    where: {
      id: userId,
      roles: {
        some: {
          role: {
            name: roleName,
          },
        },
      },
    },
  });

  return count > 0;
}

export async function assignRoleToUser(userId: string, roleId: string) {
  return await prisma.userRole.create({
    data: {
      userId,
      roleId,
    },
  });
}

export async function removeRoleFromUser(userId: string, roleId: string) {
  return await prisma.userRole.deleteMany({
    where: {
      userId,
      roleId,
    },
  });
}

export async function assignPermissionToRole(
  roleId: string,
  permissionId: string
) {
  return await prisma.rolePermission.create({
    data: {
      roleId,
      permissionId,
    },
  });
}
