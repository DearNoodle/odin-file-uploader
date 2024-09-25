/*
  Warnings:

  - You are about to drop the column `name` on the `files` table. All the data in the column will be lost.
  - Added the required column `filename` to the `files` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originalname` to the `files` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "files" DROP COLUMN "name",
ADD COLUMN     "filename" TEXT NOT NULL,
ADD COLUMN     "originalname" TEXT NOT NULL;
