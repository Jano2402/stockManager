/*
  Warnings:

  - You are about to drop the column `devuelve` on the `Compras` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Clientes" ADD COLUMN     "cant_bidones" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Compras" DROP COLUMN "devuelve",
ADD COLUMN     "devuelveBid" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "devuelveSif" INTEGER NOT NULL DEFAULT 0;
