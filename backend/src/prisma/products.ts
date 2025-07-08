import prisma from "./prisma";

export const createProducts = async () => {
  await prisma.productos.createMany({
    data: [
      { nombre: "Sifones", precio: 30, cantidad: 0 },
      { nombre: "Bidones6l", precio: 140, cantidad: 0 },
      { nombre: "Bidones12l", precio: 190, cantidad: 0 },
    ],
  });
};

createProducts();
