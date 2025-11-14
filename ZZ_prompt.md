crée la PermissionssPage pour la gestion des Permissionss (Permissionss), en tenant compte :

- utilise yup (import Yup from "@/lib/yupFr";)
- utilise formik
- utilise prisma
- créer usePermissionss hook avec tanstack/react-query
- je veut que les erreurs provenant du frontend ou backend soit afficher en dessous des champs concerncé ou dans un badge alert
- utilise variable API est : export const API = "/api"; (dans lib/constantes.ts)
- voir le schema des tables partagé (schema.prisma)
- utilise shadcn ui
- utilise ts au lieu de js (s'assurer et respecter toujours les typages (type safe) des données et variables)
- utilise isLoading et isPending pour disable des champs et les boutons pendant les query et mutations avec spinner dans les boutons et un spinner de chargement des données (aspect visuelle ui/ux)
- utilise modal static (utilise modal pour create, update et delete)
- intégre la gestion des relations s'ils exiPermissions
- j'utilise nextjs version 16.0.1
- faire les endpoints nécessaire
- me donner les commandes à executer au besoin
- me retourner toujours la vesion finale des codes (prêt à coller)

document partagés :

- schema des tables

###################
// prisma/schema.prisma
generator client {
provider = "prisma-client-js"
}

datasource db {
provider = "postgresql"
url = env("DATABASE_URL")
}

model User {
id String @id @default(cuid())
email String @unique
name String
password String
roles UserRole[]
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

@@map("user")
}

model Role {
id String @id @default(cuid())
name String @unique
description String?
permissions RolePermission[]
users UserRole[]
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

@@map("role")
}

model Permission {
id String @id @default(cuid())
name String @unique
resource String // posts, users, analytics
action String // read, create, update, delete
description String?
roles RolePermission[]
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

@@unique([resource, action])
@@map("permission")
}

model UserRole {
id String @id @default(cuid())
userId String
roleId String
user User @relation(fields: [userId], references: [id], onDelete: Cascade)
role Role @relation(fields: [roleId], references: [id], onDelete: Cascade)
createdAt DateTime @default(now())

@@unique([userId, roleId])
@@map("role_user")
}

model RolePermission {
id String @id @default(cuid())
roleId String
permissionId String
role Role @relation(fields: [roleId], references: [id], onDelete: Cascade)
permission Permission @relation(fields: [permissionId], references: [id], onDelete: Cascade)
createdAt DateTime @default(now())

@@unique([roleId, permissionId])
@@map("permission_role")
}

model Site {
id String @id @default(uuid())
name String @unique
active Boolean @default(true)
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

@@map("site")
}
