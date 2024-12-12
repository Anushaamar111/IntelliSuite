/*
  Warnings:

  - The primary key for the `video` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `video` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "video" DROP CONSTRAINT "video_pkey",
ADD COLUMN     "userId" TEXT,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "video_pkey" PRIMARY KEY ("id");
