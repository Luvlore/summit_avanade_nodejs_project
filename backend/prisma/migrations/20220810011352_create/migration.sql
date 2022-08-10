/*
  Warnings:

  - You are about to drop the column `location` on the `tables` table. All the data in the column will be lost.
  - Added the required column `location_id` to the `tables` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tables" DROP COLUMN "location",
ADD COLUMN     "location_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Location" (
    "location_id" SERIAL NOT NULL,
    "location_name" TEXT NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("location_id")
);

-- AddForeignKey
ALTER TABLE "tables" ADD CONSTRAINT "tables_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "Location"("location_id") ON DELETE RESTRICT ON UPDATE CASCADE;
