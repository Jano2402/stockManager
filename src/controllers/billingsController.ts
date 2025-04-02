import { Request, Response } from "express";
import prisma from "../prisma/prisma";

export const getPurchasesByDates = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { fechaInicio, fechaFin } = req.query;

  try {
    if (!fechaInicio || !fechaFin) {
      res
        .status(400)
        .json({ error: "Debe proporcionar fechaInicio y fechaFin" });
      return;
    }

    const compras = await prisma.compras.findMany({
      where: {
        fecha: {
          gte: new Date(`${fechaInicio}T00:00:00.000Z`), // Inicio del día
          lte: new Date(`${fechaFin}T23:59:59.999Z`), // Fin del día
        },
      },
      include: {
        cliente: true, // Incluye datos del cliente si la relación existe
      },
      orderBy: {
        fecha: "asc", // Ordena por fecha ascendente
      },
    });

    res.json(compras);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "Hubo un error al obtener las compras" });
  }
};
