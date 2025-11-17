/*
  Warnings:

  - You are about to drop the `permission_role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `role_user` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `site` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "permission_role" DROP CONSTRAINT "permission_role_permissionId_fkey";

-- DropForeignKey
ALTER TABLE "permission_role" DROP CONSTRAINT "permission_role_roleId_fkey";

-- DropForeignKey
ALTER TABLE "role_user" DROP CONSTRAINT "role_user_roleId_fkey";

-- DropForeignKey
ALTER TABLE "role_user" DROP CONSTRAINT "role_user_userId_fkey";

-- DropTable
DROP TABLE "permission_role";

-- DropTable
DROP TABLE "role";

-- DropTable
DROP TABLE "role_user";

-- DropTable
DROP TABLE "site";

-- DropTable
DROP TABLE "user";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "id" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sites" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "typeparcs" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "typeparcs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parcs" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "typeparcId" INTEGER NOT NULL,

    CONSTRAINT "parcs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "typeconsommationlub" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "typeconsommationlub_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "typeconsommationlub_parc" (
    "parcId" INTEGER NOT NULL,
    "typeconsommationlubId" INTEGER NOT NULL,

    CONSTRAINT "typeconsommationlub_parc_pkey" PRIMARY KEY ("parcId","typeconsommationlubId")
);

-- CreateTable
CREATE TABLE "lubrifiants" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "typelubrifiantId" INTEGER NOT NULL,

    CONSTRAINT "lubrifiants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lubrifiant_parc" (
    "parcId" INTEGER NOT NULL,
    "lubrifiantId" INTEGER NOT NULL,

    CONSTRAINT "lubrifiant_parc_pkey" PRIMARY KEY ("parcId","lubrifiantId")
);

-- CreateTable
CREATE TABLE "engins" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "parcId" INTEGER NOT NULL,
    "siteId" TEXT NOT NULL,
    "initialHeureChassis" DOUBLE PRECISION DEFAULT 0,

    CONSTRAINT "engins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "typepannes" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "typepannes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "typepanne_parc" (
    "parcId" INTEGER NOT NULL,
    "typepanneId" INTEGER NOT NULL,

    CONSTRAINT "typepanne_parc_pkey" PRIMARY KEY ("parcId","typepanneId")
);

-- CreateTable
CREATE TABLE "pannes" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "typepanneId" INTEGER NOT NULL,

    CONSTRAINT "pannes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saisiehrms" (
    "id" SERIAL NOT NULL,
    "du" TIMESTAMP(3) NOT NULL,
    "enginId" INTEGER NOT NULL,
    "siteId" TEXT NOT NULL,
    "hrm" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "saisiehrms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saisiehim" (
    "id" SERIAL NOT NULL,
    "panneId" INTEGER NOT NULL,
    "him" DOUBLE PRECISION NOT NULL,
    "ni" INTEGER NOT NULL,
    "saisiehrmId" INTEGER NOT NULL,
    "enginId" INTEGER,
    "obs" TEXT,

    CONSTRAINT "saisiehim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "typelubrifiants" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "typelubrifiants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saisielubrifiants" (
    "id" SERIAL NOT NULL,
    "lubrifiantId" INTEGER NOT NULL,
    "qte" DOUBLE PRECISION NOT NULL,
    "obs" TEXT,
    "saisiehimId" INTEGER NOT NULL,
    "typeconsommationlubId" INTEGER,

    CONSTRAINT "saisielubrifiants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "objectifs" (
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

    CONSTRAINT "objectifs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_userId_roleId_key" ON "user_roles"("userId", "roleId");

-- CreateIndex
CREATE UNIQUE INDEX "role_permissions_roleId_permissionId_key" ON "role_permissions"("roleId", "permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "sites_name_key" ON "sites"("name");

-- CreateIndex
CREATE UNIQUE INDEX "typeparcs_name_key" ON "typeparcs"("name");

-- CreateIndex
CREATE UNIQUE INDEX "parcs_name_key" ON "parcs"("name");

-- CreateIndex
CREATE UNIQUE INDEX "typeconsommationlub_name_key" ON "typeconsommationlub"("name");

-- CreateIndex
CREATE UNIQUE INDEX "lubrifiants_name_key" ON "lubrifiants"("name");

-- CreateIndex
CREATE UNIQUE INDEX "engins_name_key" ON "engins"("name");

-- CreateIndex
CREATE UNIQUE INDEX "typepannes_name_key" ON "typepannes"("name");

-- CreateIndex
CREATE UNIQUE INDEX "pannes_name_key" ON "pannes"("name");

-- CreateIndex
CREATE UNIQUE INDEX "saisiehrms_du_enginId_key" ON "saisiehrms"("du", "enginId");

-- CreateIndex
CREATE UNIQUE INDEX "saisiehim_panneId_saisiehrmId_key" ON "saisiehim"("panneId", "saisiehrmId");

-- CreateIndex
CREATE UNIQUE INDEX "typelubrifiants_name_key" ON "typelubrifiants"("name");

-- CreateIndex
CREATE UNIQUE INDEX "objectifs_annee_parcId_siteId_key" ON "objectifs"("annee", "parcId", "siteId");

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parcs" ADD CONSTRAINT "parcs_typeparcId_fkey" FOREIGN KEY ("typeparcId") REFERENCES "typeparcs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "typeconsommationlub_parc" ADD CONSTRAINT "typeconsommationlub_parc_parcId_fkey" FOREIGN KEY ("parcId") REFERENCES "parcs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "typeconsommationlub_parc" ADD CONSTRAINT "typeconsommationlub_parc_typeconsommationlubId_fkey" FOREIGN KEY ("typeconsommationlubId") REFERENCES "typeconsommationlub"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lubrifiants" ADD CONSTRAINT "lubrifiants_typelubrifiantId_fkey" FOREIGN KEY ("typelubrifiantId") REFERENCES "typelubrifiants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lubrifiant_parc" ADD CONSTRAINT "lubrifiant_parc_parcId_fkey" FOREIGN KEY ("parcId") REFERENCES "parcs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lubrifiant_parc" ADD CONSTRAINT "lubrifiant_parc_lubrifiantId_fkey" FOREIGN KEY ("lubrifiantId") REFERENCES "lubrifiants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "engins" ADD CONSTRAINT "engins_parcId_fkey" FOREIGN KEY ("parcId") REFERENCES "parcs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "engins" ADD CONSTRAINT "engins_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "typepanne_parc" ADD CONSTRAINT "typepanne_parc_parcId_fkey" FOREIGN KEY ("parcId") REFERENCES "parcs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "typepanne_parc" ADD CONSTRAINT "typepanne_parc_typepanneId_fkey" FOREIGN KEY ("typepanneId") REFERENCES "typepannes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pannes" ADD CONSTRAINT "pannes_typepanneId_fkey" FOREIGN KEY ("typepanneId") REFERENCES "typepannes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saisiehrms" ADD CONSTRAINT "saisiehrms_enginId_fkey" FOREIGN KEY ("enginId") REFERENCES "engins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saisiehrms" ADD CONSTRAINT "saisiehrms_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saisiehim" ADD CONSTRAINT "saisiehim_panneId_fkey" FOREIGN KEY ("panneId") REFERENCES "pannes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saisiehim" ADD CONSTRAINT "saisiehim_saisiehrmId_fkey" FOREIGN KEY ("saisiehrmId") REFERENCES "saisiehrms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saisiehim" ADD CONSTRAINT "saisiehim_enginId_fkey" FOREIGN KEY ("enginId") REFERENCES "engins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saisielubrifiants" ADD CONSTRAINT "saisielubrifiants_lubrifiantId_fkey" FOREIGN KEY ("lubrifiantId") REFERENCES "lubrifiants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saisielubrifiants" ADD CONSTRAINT "saisielubrifiants_saisiehimId_fkey" FOREIGN KEY ("saisiehimId") REFERENCES "saisiehim"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saisielubrifiants" ADD CONSTRAINT "saisielubrifiants_typeconsommationlubId_fkey" FOREIGN KEY ("typeconsommationlubId") REFERENCES "typeconsommationlub"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "objectifs" ADD CONSTRAINT "objectifs_parcId_fkey" FOREIGN KEY ("parcId") REFERENCES "parcs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "objectifs" ADD CONSTRAINT "objectifs_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
