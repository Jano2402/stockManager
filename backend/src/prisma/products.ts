import prisma from "./prisma";

export const createProducts = async () => {
  await prisma.productos.createMany({
    data: [
      { nombre: "Sifones", precio: 34, cantidad: 0 },
      { nombre: "Bidones6l", precio: 145, cantidad: 0 },
      { nombre: "Bidones12l", precio: 210, cantidad: 0 },
    ],
  });
};

createProducts();
