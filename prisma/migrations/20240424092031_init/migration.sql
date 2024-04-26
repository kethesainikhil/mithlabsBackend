-- CreateTable
CREATE TABLE "Hotels" (
    "id" SERIAL NOT NULL,
    "hotel_name" TEXT NOT NULL,
    "hotel_address" TEXT NOT NULL,
    "hotel_city" TEXT NOT NULL,
    "hotel_state" TEXT NOT NULL,
    "hotel_country" TEXT NOT NULL,
    "hotel_zipcode" TEXT NOT NULL,
    "checkin" TEXT NOT NULL,
    "checkout" TEXT NOT NULL,
    "star_rating" INTEGER NOT NULL,
    "overview" TEXT NOT NULL,
    "rates_from" INTEGER NOT NULL,
    "image_url" TEXT NOT NULL,

    CONSTRAINT "Hotels_pkey" PRIMARY KEY ("id")
);
