-- AlterTable
ALTER TABLE "saisiehims" ADD COLUMN     "origineSaisieId" TEXT;

-- AlterTable
ALTER TABLE "saisiehrms" ADD COLUMN     "origineSaisieId" TEXT;

-- AlterTable
ALTER TABLE "saisielubrifiants" ADD COLUMN     "origineSaisieId" TEXT;

-- CreateTable
CREATE TABLE "origine_saisies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "origine_saisies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "origine_saisies_name_key" ON "origine_saisies"("name");

-- CreateIndex
CREATE UNIQUE INDEX "origine_saisies_code_key" ON "origine_saisies"("code");

-- AddForeignKey
ALTER TABLE "saisiehrms" ADD CONSTRAINT "saisiehrms_origineSaisieId_fkey" FOREIGN KEY ("origineSaisieId") REFERENCES "origine_saisies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saisiehims" ADD CONSTRAINT "saisiehims_origineSaisieId_fkey" FOREIGN KEY ("origineSaisieId") REFERENCES "origine_saisies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saisielubrifiants" ADD CONSTRAINT "saisielubrifiants_origineSaisieId_fkey" FOREIGN KEY ("origineSaisieId") REFERENCES "origine_saisies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
