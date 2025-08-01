/*
  Warnings:

  - You are about to alter the column `accountId` on the `OrganizerProfile` table. The data in that column could be lost. The data in that column will be cast from `VarChar(20)` to `VarChar(10)`.

*/
-- AlterTable
ALTER TABLE "OrganizerProfile" ALTER COLUMN "accountId" SET DATA TYPE VARCHAR(10);
