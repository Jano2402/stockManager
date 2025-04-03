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

export const updateProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { precio } = req.body;

    const updatedProduct = await prisma.productos.update({
      where: { id: Number(id) },
      data: {
        precio,
      },
    });

    res.status(200).json(updatedProduct);
  } catch (error: any) {
    res.status(500).json({ error: "Hubo un error al obtener los productos" });
  }
};
