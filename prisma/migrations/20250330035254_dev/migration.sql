-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MODERATOR', 'USER');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Clientes" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "telefono" TEXT,
    "deuda" INTEGER NOT NULL DEFAULT 0,
    "cant_envases" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Compras" (
    "id" SERIAL NOT NULL,
    "cliente_id" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sifones" INTEGER NOT NULL DEFAULT 0,
    "bidones_12l" INTEGER NOT NULL DEFAULT 0,
    "bidones_6l" INTEGER NOT NULL DEFAULT 0,
    "pago" INTEGER NOT NULL DEFAULT 0,
    "deuda" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Compras_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Compras" ADD CONSTRAINT "Compras_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "Clientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
