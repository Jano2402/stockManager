/*
  Warnings:

  - A unique constraint covering the columns `[nombre]` on the table `Clientes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Clientes_nombre_key" ON "Clientes"("nombre");
