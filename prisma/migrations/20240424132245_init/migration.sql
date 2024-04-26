-- CreateTable
CREATE TABLE "HotelInteractions" (
    "id" SERIAL NOT NULL,
    "hotel_id" INTEGER NOT NULL,
    "visits" INTEGER NOT NULL,
    "Drafts" INTEGER NOT NULL,
    "Bookings" INTEGER NOT NULL,

    CONSTRAINT "HotelInteractions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "HotelInteractions" ADD CONSTRAINT "HotelInteractions_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "Hotels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
