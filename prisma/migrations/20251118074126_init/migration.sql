/*
  Warnings:

  - The primary key for the `lubrifiant_parc` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `typeconsommationlub_parc` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `typepanne_parc` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `engin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `lubrifiant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `objectif` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `panne` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `parc` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `permission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `resource` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `role_permission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `saisiehim` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `saisiehrm` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `saisielubrifiant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `typeconsommationlub` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `typelubrifiant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `typepanne` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `typeparc` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_role` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "engin" DROP CONSTRAINT "engin_parcId_fkey";

-- DropForeignKey
ALTER TABLE "engin" DROP CONSTRAINT "engin_siteId_fkey";

-- DropForeignKey
ALTER TABLE "lubrifiant" DROP CONSTRAINT "lubrifiant_typelubrifiantId_fkey";

-- DropForeignKey
ALTER TABLE "lubrifiant_parc" DROP CONSTRAINT "lubrifiant_parc_lubrifiantId_fkey";

-- DropForeignKey
ALTER TABLE "lubrifiant_parc" DROP CONSTRAINT "lubrifiant_parc_parcId_fkey";

-- DropForeignKey
ALTER TABLE "objectif" DROP CONSTRAINT "objectif_parcId_fkey";

-- DropForeignKey
ALTER TABLE "objectif" DROP CONSTRAINT "objectif_siteId_fkey";

-- DropForeignKey
ALTER TABLE "panne" DROP CONSTRAINT "panne_typepanneId_fkey";

-- DropForeignKey
ALTER TABLE "parc" DROP CONSTRAINT "parc_typeparcId_fkey";

-- DropForeignKey
ALTER TABLE "permission" DROP CONSTRAINT "permission_resourceId_fkey";

-- DropForeignKey
ALTER TABLE "role_permission" DROP CONSTRAINT "role_permission_permissionId_fkey";

-- DropForeignKey
ALTER TABLE "role_permission" DROP CONSTRAINT "role_permission_roleId_fkey";

-- DropForeignKey
ALTER TABLE "saisiehim" DROP CONSTRAINT "saisiehim_enginId_fkey";

-- DropForeignKey
ALTER TABLE "saisiehim" DROP CONSTRAINT "saisiehim_panneId_fkey";

-- DropForeignKey
ALTER TABLE "saisiehim" DROP CONSTRAINT "saisiehim_saisiehrmId_fkey";

-- DropForeignKey
ALTER TABLE "saisiehrm" DROP CONSTRAINT "saisiehrm_enginId_fkey";

-- DropForeignKey
ALTER TABLE "saisiehrm" DROP CONSTRAINT "saisiehrm_siteId_fkey";

-- DropForeignKey
ALTER TABLE "saisielubrifiant" DROP CONSTRAINT "saisielubrifiant_lubrifiantId_fkey";

-- DropForeignKey
ALTER TABLE "saisielubrifiant" DROP CONSTRAINT "saisielubrifiant_saisiehimId_fkey";

-- DropForeignKey
ALTER TABLE "saisielubrifiant" DROP CONSTRAINT "saisielubrifiant_typeconsommationlubId_fkey";

-- DropForeignKey
ALTER TABLE "typeconsommationlub_parc" DROP CONSTRAINT "typeconsommationlub_parc_parcId_fkey";

-- DropForeignKey
ALTER TABLE "typeconsommationlub_parc" DROP CONSTRAINT "typeconsommationlub_parc_typeconsommationlubId_fkey";

-- DropForeignKey
ALTER TABLE "typepanne_parc" DROP CONSTRAINT "typepanne_parc_parcId_fkey";

-- DropForeignKey
ALTER TABLE "typepanne_parc" DROP CONSTRAINT "typepanne_parc_typepanneId_fkey";

-- DropForeignKey
ALTER TABLE "user_role" DROP CONSTRAINT "user_role_roleId_fkey";

-- DropForeignKey
ALTER TABLE "user_role" DROP CONSTRAINT "user_role_userId_fkey";

-- AlterTable
ALTER TABLE "lubrifiant_parc" DROP CONSTRAINT "lubrifiant_parc_pkey",
ALTER COLUMN "parcId" SET DATA TYPE TEXT,
ALTER COLUMN "lubrifiantId" SET DATA TYPE TEXT,
ADD CONSTRAINT "lubrifiant_parc_pkey" PRIMARY KEY ("parcId", "lubrifiantId");

-- AlterTable
ALTER TABLE "typeconsommationlub_parc" DROP CONSTRAINT "typeconsommationlub_parc_pkey",
ALTER COLUMN "parcId" SET DATA TYPE TEXT,
ALTER COLUMN "typeconsommationlubId" SET DATA TYPE TEXT,
ADD CONSTRAINT "typeconsommationlub_parc_pkey" PRIMARY KEY ("parcId", "typeconsommationlubId");

-- AlterTable
ALTER TABLE "typepanne_parc" DROP CONSTRAINT "typepanne_parc_pkey",
ALTER COLUMN "parcId" SET DATA TYPE TEXT,
ALTER COLUMN "typepanneId" SET DATA TYPE TEXT,
ADD CONSTRAINT "typepanne_parc_pkey" PRIMARY KEY ("parcId", "typepanneId");

-- DropTable
DROP TABLE "engin";

-- DropTable
DROP TABLE "lubrifiant";

-- DropTable
DROP TABLE "objectif";

-- DropTable
DROP TABLE "panne";

-- DropTable
DROP TABLE "parc";

-- DropTable
DROP TABLE "permission";

-- DropTable
DROP TABLE "resource";

-- DropTable
DROP TABLE "role";

-- DropTable
DROP TABLE "role_permission";

-- DropTable
DROP TABLE "saisiehim";

-- DropTable
DROP TABLE "saisiehrm";

-- DropTable
DROP TABLE "saisielubrifiant";

-- DropTable
DROP TABLE "typeconsommationlub";

-- DropTable
DROP TABLE "typelubrifiant";

-- DropTable
DROP TABLE "typepanne";

-- DropTable
DROP TABLE "typeparc";

-- DropTable
DROP TABLE "user";

-- DropTable
DROP TABLE "user_role";

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
CREATE TABLE "permissions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "action" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "resources" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "typepannes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "typepannes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "origine_pannes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "origine_pannes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "niveau_urgences" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "level" INTEGER NOT NULL,
    "color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "niveau_urgences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "statut_interventions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "statut_interventions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pannes" (
    "id" TEXT NOT NULL,
    "code" TEXT,
    "description" TEXT NOT NULL,
    "dateApparition" TIMESTAMP(3) NOT NULL,
    "dateExecution" TIMESTAMP(3),
    "dateCloture" TIMESTAMP(3),
    "observations" TEXT,
    "tempsArret" DOUBLE PRECISION,
    "coutEstime" DOUBLE PRECISION,
    "typepanneId" TEXT NOT NULL,
    "originePanneId" TEXT NOT NULL,
    "niveauUrgenceId" TEXT NOT NULL,
    "enginId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pannes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interventions" (
    "id" TEXT NOT NULL,
    "dateDebut" TIMESTAMP(3) NOT NULL,
    "dateFin" TIMESTAMP(3),
    "descriptionTravaux" TEXT NOT NULL,
    "tempsPasse" DOUBLE PRECISION,
    "observations" TEXT,
    "panneId" TEXT NOT NULL,
    "technicienId" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "statutInterventionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "interventions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categorie_pieces" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categorie_pieces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pieces" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "prixUnitaire" DOUBLE PRECISION,
    "stockActuel" INTEGER NOT NULL DEFAULT 0,
    "stockMinimum" INTEGER NOT NULL DEFAULT 5,
    "fournisseur" TEXT,
    "categoriePieceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pieces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pieces_demandees" (
    "id" TEXT NOT NULL,
    "quantite" INTEGER NOT NULL,
    "prix" DOUBLE PRECISION,
    "observations" TEXT,
    "panneId" TEXT NOT NULL,
    "pieceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pieces_demandees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pieces_utilisees" (
    "id" TEXT NOT NULL,
    "quantite" INTEGER NOT NULL,
    "prix" DOUBLE PRECISION,
    "interventionId" TEXT NOT NULL,
    "pieceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pieces_utilisees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "typeparcs" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "typeparcs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parcs" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "typeparcId" TEXT NOT NULL,

    CONSTRAINT "parcs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "typeconsommationlubs" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "typeconsommationlubs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lubrifiants" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "typelubrifiantId" TEXT NOT NULL,

    CONSTRAINT "lubrifiants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "engins" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "parcId" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "initialHeureChassis" DOUBLE PRECISION DEFAULT 0,

    CONSTRAINT "engins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saisiehrms" (
    "id" TEXT NOT NULL,
    "du" TIMESTAMP(3) NOT NULL,
    "enginId" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "hrm" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "saisiehrms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saisiehims" (
    "id" TEXT NOT NULL,
    "panneId" TEXT NOT NULL,
    "him" DOUBLE PRECISION NOT NULL,
    "ni" INTEGER NOT NULL,
    "saisiehrmId" TEXT NOT NULL,
    "enginId" TEXT,
    "obs" TEXT,

    CONSTRAINT "saisiehims_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "typelubrifiants" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "typelubrifiants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saisielubrifiants" (
    "id" TEXT NOT NULL,
    "lubrifiantId" TEXT NOT NULL,
    "qte" DOUBLE PRECISION NOT NULL,
    "obs" TEXT,
    "saisiehimId" TEXT NOT NULL,
    "typeconsommationlubId" TEXT,

    CONSTRAINT "saisielubrifiants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "objectifs" (
    "id" TEXT NOT NULL,
    "annee" INTEGER NOT NULL,
    "parcId" TEXT NOT NULL,
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
CREATE UNIQUE INDEX "permissions_name_key" ON "permissions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_userId_roleId_key" ON "user_roles"("userId", "roleId");

-- CreateIndex
CREATE UNIQUE INDEX "role_permissions_roleId_permissionId_key" ON "role_permissions"("roleId", "permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "resources_name_key" ON "resources"("name");

-- CreateIndex
CREATE UNIQUE INDEX "typepannes_name_key" ON "typepannes"("name");

-- CreateIndex
CREATE UNIQUE INDEX "origine_pannes_name_key" ON "origine_pannes"("name");

-- CreateIndex
CREATE UNIQUE INDEX "niveau_urgences_name_key" ON "niveau_urgences"("name");

-- CreateIndex
CREATE UNIQUE INDEX "statut_interventions_name_key" ON "statut_interventions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "pannes_code_key" ON "pannes"("code");

-- CreateIndex
CREATE UNIQUE INDEX "categorie_pieces_name_key" ON "categorie_pieces"("name");

-- CreateIndex
CREATE UNIQUE INDEX "pieces_reference_key" ON "pieces"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "pieces_demandees_panneId_pieceId_key" ON "pieces_demandees"("panneId", "pieceId");

-- CreateIndex
CREATE UNIQUE INDEX "pieces_utilisees_interventionId_pieceId_key" ON "pieces_utilisees"("interventionId", "pieceId");

-- CreateIndex
CREATE UNIQUE INDEX "typeparcs_name_key" ON "typeparcs"("name");

-- CreateIndex
CREATE UNIQUE INDEX "parcs_name_key" ON "parcs"("name");

-- CreateIndex
CREATE UNIQUE INDEX "typeconsommationlubs_name_key" ON "typeconsommationlubs"("name");

-- CreateIndex
CREATE UNIQUE INDEX "lubrifiants_name_key" ON "lubrifiants"("name");

-- CreateIndex
CREATE UNIQUE INDEX "engins_name_key" ON "engins"("name");

-- CreateIndex
CREATE UNIQUE INDEX "saisiehrms_du_enginId_key" ON "saisiehrms"("du", "enginId");

-- CreateIndex
CREATE UNIQUE INDEX "saisiehims_panneId_saisiehrmId_key" ON "saisiehims"("panneId", "saisiehrmId");

-- CreateIndex
CREATE UNIQUE INDEX "typelubrifiants_name_key" ON "typelubrifiants"("name");

-- CreateIndex
CREATE UNIQUE INDEX "objectifs_annee_parcId_siteId_key" ON "objectifs"("annee", "parcId", "siteId");

-- AddForeignKey
ALTER TABLE "permissions" ADD CONSTRAINT "permissions_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "resources"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pannes" ADD CONSTRAINT "pannes_typepanneId_fkey" FOREIGN KEY ("typepanneId") REFERENCES "typepannes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pannes" ADD CONSTRAINT "pannes_originePanneId_fkey" FOREIGN KEY ("originePanneId") REFERENCES "origine_pannes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pannes" ADD CONSTRAINT "pannes_niveauUrgenceId_fkey" FOREIGN KEY ("niveauUrgenceId") REFERENCES "niveau_urgences"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pannes" ADD CONSTRAINT "pannes_enginId_fkey" FOREIGN KEY ("enginId") REFERENCES "engins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interventions" ADD CONSTRAINT "interventions_panneId_fkey" FOREIGN KEY ("panneId") REFERENCES "pannes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interventions" ADD CONSTRAINT "interventions_technicienId_fkey" FOREIGN KEY ("technicienId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interventions" ADD CONSTRAINT "interventions_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interventions" ADD CONSTRAINT "interventions_statutInterventionId_fkey" FOREIGN KEY ("statutInterventionId") REFERENCES "statut_interventions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pieces" ADD CONSTRAINT "pieces_categoriePieceId_fkey" FOREIGN KEY ("categoriePieceId") REFERENCES "categorie_pieces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pieces_demandees" ADD CONSTRAINT "pieces_demandees_panneId_fkey" FOREIGN KEY ("panneId") REFERENCES "pannes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pieces_demandees" ADD CONSTRAINT "pieces_demandees_pieceId_fkey" FOREIGN KEY ("pieceId") REFERENCES "pieces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pieces_utilisees" ADD CONSTRAINT "pieces_utilisees_interventionId_fkey" FOREIGN KEY ("interventionId") REFERENCES "interventions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pieces_utilisees" ADD CONSTRAINT "pieces_utilisees_pieceId_fkey" FOREIGN KEY ("pieceId") REFERENCES "pieces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parcs" ADD CONSTRAINT "parcs_typeparcId_fkey" FOREIGN KEY ("typeparcId") REFERENCES "typeparcs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "typeconsommationlub_parc" ADD CONSTRAINT "typeconsommationlub_parc_parcId_fkey" FOREIGN KEY ("parcId") REFERENCES "parcs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "typeconsommationlub_parc" ADD CONSTRAINT "typeconsommationlub_parc_typeconsommationlubId_fkey" FOREIGN KEY ("typeconsommationlubId") REFERENCES "typeconsommationlubs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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
ALTER TABLE "saisiehrms" ADD CONSTRAINT "saisiehrms_enginId_fkey" FOREIGN KEY ("enginId") REFERENCES "engins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saisiehrms" ADD CONSTRAINT "saisiehrms_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saisiehims" ADD CONSTRAINT "saisiehims_panneId_fkey" FOREIGN KEY ("panneId") REFERENCES "pannes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saisiehims" ADD CONSTRAINT "saisiehims_saisiehrmId_fkey" FOREIGN KEY ("saisiehrmId") REFERENCES "saisiehrms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saisiehims" ADD CONSTRAINT "saisiehims_enginId_fkey" FOREIGN KEY ("enginId") REFERENCES "engins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saisielubrifiants" ADD CONSTRAINT "saisielubrifiants_lubrifiantId_fkey" FOREIGN KEY ("lubrifiantId") REFERENCES "lubrifiants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saisielubrifiants" ADD CONSTRAINT "saisielubrifiants_saisiehimId_fkey" FOREIGN KEY ("saisiehimId") REFERENCES "saisiehims"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saisielubrifiants" ADD CONSTRAINT "saisielubrifiants_typeconsommationlubId_fkey" FOREIGN KEY ("typeconsommationlubId") REFERENCES "typeconsommationlubs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "objectifs" ADD CONSTRAINT "objectifs_parcId_fkey" FOREIGN KEY ("parcId") REFERENCES "parcs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "objectifs" ADD CONSTRAINT "objectifs_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
