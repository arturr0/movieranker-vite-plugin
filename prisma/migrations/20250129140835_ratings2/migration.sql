/*
  Warnings:

  - A unique constraint covering the columns `[userEmail]` on the table `RatingMovie` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userEmail]` on the table `RatingPerson` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "RatingMovie" DROP CONSTRAINT "RatingMovie_userEmail_fkey";

-- DropForeignKey
ALTER TABLE "RatingPerson" DROP CONSTRAINT "RatingPerson_userEmail_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "RatingMovie_userEmail_key" ON "RatingMovie"("userEmail");

-- CreateIndex
CREATE UNIQUE INDEX "RatingPerson_userEmail_key" ON "RatingPerson"("userEmail");
