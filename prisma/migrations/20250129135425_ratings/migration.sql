/*
  Warnings:

  - Added the required column `title` to the `RatingMovie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userEmail` to the `RatingMovie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `RatingPerson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userEmail` to the `RatingPerson` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RatingMovie" ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "userEmail" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "RatingPerson" ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "userEmail" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "RatingMovie" ADD CONSTRAINT "RatingMovie_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RatingPerson" ADD CONSTRAINT "RatingPerson_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE CASCADE ON UPDATE CASCADE;
