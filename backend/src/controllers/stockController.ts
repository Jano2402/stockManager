import { Request, Response } from "express";
import prisma from "../prisma/prisma";

export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const products = await prisma.productos.findMany();
    res.status(200).json(products);
  } catch (error: any) {
    res.status(500).json({ error: "Hubo un error al obtener los productos" });
  }
};

// updateProduct (versión mejorada)
export const updateProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { precio } = req.body;

  // Validación básica
  if (isNaN(Number(id))) {
    res.status(400).json({ error: "ID debe ser un número" });
    return;
  }
  if (typeof precio !== "number") {
    res.status(400).json({ error: "Precio debe ser un número" });
    return;
  }

  try {
    const updatedProduct = await prisma.productos.update({
      where: { id: Number(id) },
      data: { precio },
    });
    res.status(200).json(updatedProduct);
  } catch (error: any) {
    console.error("Error en updateProduct:", error); // Log para debug

    // Diferenciar errores de Prisma
    if (error.code === "P2025") {
      res.status(404).json({ error: "Producto no encontrado" });
    } else {
      res.status(500).json({ error: "Error al actualizar el producto" });
    }
  }
};
