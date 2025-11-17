/*
  Warnings:

  - You are about to drop the `engins` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `lubrifiants` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `objectifs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pannes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `parcs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `permissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `resources` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `role_permissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `roles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `saisiehrms` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `saisielubrifiants` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `typelubrifiants` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `typepannes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `typeparcs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_roles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "engins" DROP CONSTRAINT "engins_parcId_fkey";

-- DropForeignKey
ALTER TABLE "engins" DROP CONSTRAINT "engins_siteId_fkey";

-- DropForeignKey
ALTER TABLE "lubrifiant_parc" DROP CONSTRAINT "lubrifiant_parc_lubrifiantId_fkey";

-- DropForeignKey
ALTER TABLE "lubrifiant_parc" DROP CONSTRAINT "lubrifiant_parc_parcId_fkey";

-- DropForeignKey
ALTER TABLE "lubrifiants" DROP CONSTRAINT "lubrifiants_typelubrifiantId_fkey";

-- DropForeignKey
ALTER TABLE "objectifs" DROP CONSTRAINT "objectifs_parcId_fkey";

-- DropForeignKey
ALTER TABLE "objectifs" DROP CONSTRAINT "objectifs_siteId_fkey";

-- DropForeignKey
ALTER TABLE "pannes" DROP CONSTRAINT "pannes_typepanneId_fkey";

-- DropForeignKey
ALTER TABLE "parcs" DROP CONSTRAINT "parcs_typeparcId_fkey";

-- DropForeignKey
ALTER TABLE "permissions" DROP CONSTRAINT "permissions_resourceId_fkey";

-- DropForeignKey
ALTER TABLE "role_permissions" DROP CONSTRAINT "role_permissions_permissionId_fkey";

-- DropForeignKey
ALTER TABLE "role_permissions" DROP CONSTRAINT "role_permissions_roleId_fkey";

-- DropForeignKey
ALTER TABLE "saisiehim" DROP CONSTRAINT "saisiehim_enginId_fkey";

-- DropForeignKey
ALTER TABLE "saisiehim" DROP CONSTRAINT "saisiehim_panneId_fkey";

-- DropForeignKey
ALTER TABLE "saisiehim" DROP CONSTRAINT "saisiehim_saisiehrmId_fkey";

-- DropForeignKey
ALTER TABLE "saisiehrms" DROP CONSTRAINT "saisiehrms_enginId_fkey";

-- DropForeignKey
ALTER TABLE "saisiehrms" DROP CONSTRAINT "saisiehrms_siteId_fkey";

-- DropForeignKey
ALTER TABLE "saisielubrifiants" DROP CONSTRAINT "saisielubrifiants_lubrifiantId_fkey";

-- DropForeignKey
ALTER TABLE "saisielubrifiants" DROP CONSTRAINT "saisielubrifiants_saisiehimId_fkey";

-- DropForeignKey
ALTER TABLE "saisielubrifiants" DROP CONSTRAINT "saisielubrifiants_typeconsommationlubId_fkey";

-- DropForeignKey
ALTER TABLE "typeconsommationlub_parc" DROP CONSTRAINT "typeconsommationlub_parc_parcId_fkey";

-- DropForeignKey
ALTER TABLE "typepanne_parc" DROP CONSTRAINT "typepanne_parc_parcId_fkey";

-- DropForeignKey
ALTER TABLE "typepanne_parc" DROP CONSTRAINT "typepanne_parc_typepanneId_fkey";

-- DropForeignKey
ALTER TABLE "user_roles" DROP CONSTRAINT "user_roles_roleId_fkey";

-- DropForeignKey
ALTER TABLE "user_roles" DROP CONSTRAINT "user_roles_userId_fkey";

-- DropTable
DROP TABLE "engins";

-- DropTable
DROP TABLE "lubrifiants";

-- DropTable
DROP TABLE "objectifs";

-- DropTable
DROP TABLE "pannes";

-- DropTable
DROP TABLE "parcs";

-- DropTable
DROP TABLE "permissions";

-- DropTable
DROP TABLE "resources";

-- DropTable
DROP TABLE "role_permissions";

-- DropTable
DROP TABLE "roles";

-- DropTable
DROP TABLE "saisiehrms";

-- DropTable
DROP TABLE "saisielubrifiants";

-- DropTable
DROP TABLE "typelubrifiants";

-- DropTable
DROP TABLE "typepannes";

-- DropTable
DROP TABLE "typeparcs";

-- DropTable
DROP TABLE "user_roles";

-- DropTable
DROP TABLE "users";

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permission" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "action" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_role" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permission" (
    "id" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "role_permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resource" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "typeparc" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "typeparc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parc" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "typeparcId" INTEGER NOT NULL,

    CONSTRAINT "parc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lubrifiant" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "typelubrifiantId" INTEGER NOT NULL,

    CONSTRAINT "lubrifiant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "engin" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "parcId" INTEGER NOT NULL,
    "siteId" TEXT NOT NULL,
    "initialHeureChassis" DOUBLE PRECISION DEFAULT 0,

    CONSTRAINT "engin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "typepanne" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "typepanne_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "panne" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "typepanneId" INTEGER NOT NULL,

    CONSTRAINT "panne_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saisiehrm" (
    "id" SERIAL NOT NULL,
    "du" TIMESTAMP(3) NOT NULL,
    "enginId" INTEGER NOT NULL,
    "siteId" TEXT NOT NULL,
    "hrm" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "saisiehrm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "typelubrifiant" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "typelubrifiant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saisielubrifiant" (
    "id" SERIAL NOT NULL,
    "lubrifiantId" INTEGER NOT NULL,
    "qte" DOUBLE PRECISION NOT NULL,
    "obs" TEXT,
    "saisiehimId" INTEGER NOT NULL,
    "typeconsommationlubId" INTEGER,

    CONSTRAINT "saisielubrifiant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "objectif" (
    "id" SERIAL NOT NULL,
    "annee" INTEGER NOT NULL,
    "parcId" INTEGER NOT NULL,
    "siteId" TEXT NOT NULL,
    "dispo" DOUBLE PRECISION,
    "mtbf" DOUBLE PRECISION,
    "tdm" DOUBLE PRECISION,
    "spe_huile" DOUBLE PRECISION,
    "spe_go" DOUBLE PRECISION,
    "spe_graisse" DOUBLE PRECISION,

    CONSTRAINT "objectif_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "role_name_key" ON "role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "permission_name_key" ON "permission"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_role_userId_roleId_key" ON "user_role"("userId", "roleId");

-- CreateIndex
CREATE UNIQUE INDEX "role_permission_roleId_permissionId_key" ON "role_permission"("roleId", "permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "resource_name_key" ON "resource"("name");

-- CreateIndex
CREATE UNIQUE INDEX "typeparc_name_key" ON "typeparc"("name");

-- CreateIndex
CREATE UNIQUE INDEX "parc_name_key" ON "parc"("name");

-- CreateIndex
CREATE UNIQUE INDEX "lubrifiant_name_key" ON "lubrifiant"("name");

-- CreateIndex
CREATE UNIQUE INDEX "engin_name_key" ON "engin"("name");

-- CreateIndex
CREATE UNIQUE INDEX "typepanne_name_key" ON "typepanne"("name");

-- CreateIndex
CREATE UNIQUE INDEX "panne_name_key" ON "panne"("name");

-- CreateIndex
CREATE UNIQUE INDEX "saisiehrm_du_enginId_key" ON "saisiehrm"("du", "enginId");

-- CreateIndex
CREATE UNIQUE INDEX "typelubrifiant_name_key" ON "typelubrifiant"("name");

-- CreateIndex
CREATE UNIQUE INDEX "objectif_annee_parcId_siteId_key" ON "objectif"("annee", "parcId", "siteId");

-- AddForeignKey
ALTER TABLE "permission" ADD CONSTRAINT "permission_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_role" ADD CONSTRAINT "user_role_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_role" ADD CONSTRAINT "user_role_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permission" ADD CONSTRAINT "role_permission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permission" ADD CONSTRAINT "role_permission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parc" ADD CONSTRAINT "parc_typeparcId_fkey" FOREIGN KEY ("typeparcId") REFERENCES "typeparc"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "typeconsommationlub_parc" ADD CONSTRAINT "typeconsommationlub_parc_parcId_fkey" FOREIGN KEY ("parcId") REFERENCES "parc"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lubrifiant" ADD CONSTRAINT "lubrifiant_typelubrifiantId_fkey" FOREIGN KEY ("typelubrifiantId") REFERENCES "typelubrifiant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lubrifiant_parc" ADD CONSTRAINT "lubrifiant_parc_parcId_fkey" FOREIGN KEY ("parcId") REFERENCES "parc"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lubrifiant_parc" ADD CONSTRAINT "lubrifiant_parc_lubrifiantId_fkey" FOREIGN KEY ("lubrifiantId") REFERENCES "lubrifiant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "engin" ADD CONSTRAINT "engin_parcId_fkey" FOREIGN KEY ("parcId") REFERENCES "parc"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "engin" ADD CONSTRAINT "engin_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "typepanne_parc" ADD CONSTRAINT "typepanne_parc_parcId_fkey" FOREIGN KEY ("parcId") REFERENCES "parc"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "typepanne_parc" ADD CONSTRAINT "typepanne_parc_typepanneId_fkey" FOREIGN KEY ("typepanneId") REFERENCES "typepanne"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "panne" ADD CONSTRAINT "panne_typepanneId_fkey" FOREIGN KEY ("typepanneId") REFERENCES "typepanne"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saisiehrm" ADD CONSTRAINT "saisiehrm_enginId_fkey" FOREIGN KEY ("enginId") REFERENCES "engin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saisiehrm" ADD CONSTRAINT "saisiehrm_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saisiehim" ADD CONSTRAINT "saisiehim_panneId_fkey" FOREIGN KEY ("panneId") REFERENCES "panne"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saisiehim" ADD CONSTRAINT "saisiehim_saisiehrmId_fkey" FOREIGN KEY ("saisiehrmId") REFERENCES "saisiehrm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saisiehim" ADD CONSTRAINT "saisiehim_enginId_fkey" FOREIGN KEY ("enginId") REFERENCES "engin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saisielubrifiant" ADD CONSTRAINT "saisielubrifiant_lubrifiantId_fkey" FOREIGN KEY ("lubrifiantId") REFERENCES "lubrifiant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saisielubrifiant" ADD CONSTRAINT "saisielubrifiant_saisiehimId_fkey" FOREIGN KEY ("saisiehimId") REFERENCES "saisiehim"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saisielubrifiant" ADD CONSTRAINT "saisielubrifiant_typeconsommationlubId_fkey" FOREIGN KEY ("typeconsommationlubId") REFERENCES "typeconsommationlub"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "objectif" ADD CONSTRAINT "objectif_parcId_fkey" FOREIGN KEY ("parcId") REFERENCES "parc"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "objectif" ADD CONSTRAINT "objectif_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
