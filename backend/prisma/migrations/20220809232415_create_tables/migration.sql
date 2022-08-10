-- CreateTable
CREATE TABLE "tables" (
    "table_id" SERIAL NOT NULL,
    "table_name" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "is_available" BOOLEAN NOT NULL,
    "location" TEXT NOT NULL,

    CONSTRAINT "tables_pkey" PRIMARY KEY ("table_id")
);
