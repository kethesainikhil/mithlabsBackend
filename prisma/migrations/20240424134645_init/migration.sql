/*
  Warnings:

  - Made the column `visits` on table `HotelInteractions` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "HotelInteractions" ALTER COLUMN "visits" SET NOT NULL;
