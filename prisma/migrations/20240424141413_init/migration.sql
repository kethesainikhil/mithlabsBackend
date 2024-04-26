/*
  Warnings:

  - A unique constraint covering the columns `[hotel_id]` on the table `HotelInteractions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "HotelInteractions_hotel_id_key" ON "HotelInteractions"("hotel_id");
