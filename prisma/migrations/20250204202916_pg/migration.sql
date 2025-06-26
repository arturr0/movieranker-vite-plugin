/*
  Warnings:

  - A unique constraint covering the columns `[userEmail,tmdbId]` on the table `RatingMovie` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userEmail,tmdbId]` on the table `RatingPerson` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "RatingMovie" DROP CONSTRAINT "RatingMovie_userId_fkey";

-- DropForeignKey
ALTER TABLE "RatingPerson" DROP CONSTRAINT "RatingPerson_userId_fkey";

-- DropIndex
DROP INDEX "RatingMovie_userEmail_key";

-- DropIndex
DROP INDEX "RatingMovie_userId_tmdbId_key";

-- DropIndex
DROP INDEX "RatingPerson_userEmail_key";

-- DropIndex
DROP INDEX "RatingPerson_userId_tmdbId_key";

-- AlterTable
ALTER TABLE "RatingMovie" ALTER COLUMN "rating" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "RatingPerson" ALTER COLUMN "rating" SET DATA TYPE DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "Movie" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "releaseDate" TEXT,
    "rating" DOUBLE PRECISION,
    "posterPath" TEXT,

    CONSTRAINT "Movie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Person" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "biography" TEXT,
    "profilePath" TEXT,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RatingMovie_userEmail_tmdbId_key" ON "RatingMovie"("userEmail", "tmdbId");

-- CreateIndex
CREATE UNIQUE INDEX "RatingPerson_userEmail_tmdbId_key" ON "RatingPerson"("userEmail", "tmdbId");

-- AddForeignKey
ALTER TABLE "RatingMovie" ADD CONSTRAINT "RatingMovie_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RatingMovie" ADD CONSTRAINT "RatingMovie_tmdbId_fkey" FOREIGN KEY ("tmdbId") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RatingPerson" ADD CONSTRAINT "RatingPerson_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RatingPerson" ADD CONSTRAINT "RatingPerson_tmdbId_fkey" FOREIGN KEY ("tmdbId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
