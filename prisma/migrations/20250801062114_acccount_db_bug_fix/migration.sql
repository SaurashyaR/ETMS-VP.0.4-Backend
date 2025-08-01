/*
  Warnings:

  - You are about to alter the column `accountId` on the `OrganizerProfile` table. The data in that column could be lost. The data in that column will be cast from `VarChar(10)` to `VarChar(5)`.

*/
-- AlterTable
ALTER TABLE "OrganizerProfile" ALTER COLUMN "accountId" DROP NOT NULL,
ALTER COLUMN "accountId" SET DATA TYPE VARCHAR(5);
