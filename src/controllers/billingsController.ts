import { Request, Response } from "express";
import prisma from "../prisma/prisma";

interface CompraAgrupada {
  nombre: string;
  sifones: number;
  bidon6L: number;
  bidon12L: number;
  totalPagado: number;
  totalCompra: number;
  totalDebiendo: number;
}

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

    // Agrupar compras por cliente y calcular totales
    const comprasAgrupadas = compras.reduce<Record<number, CompraAgrupada>>(
      (acc, compra) => {
        const {
          cliente,
          sifones,
          bidones_6l,
          bidones_12l,
          totalCompra,
          pago,
          deuda,
        } = compra;

        if (!acc[cliente.id]) {
          acc[cliente.id] = {
            nombre: cliente.nombre,
            sifones: 0,
            bidon6L: 0,
            bidon12L: 0,
            totalPagado: 0,
            totalCompra: 0,
            totalDebiendo: cliente.deuda, // Usar la deuda actual del cliente
          };
        }

        acc[cliente.id].sifones += sifones;
        acc[cliente.id].bidon6L += bidones_6l;
        acc[cliente.id].bidon12L += bidones_12l;
        acc[cliente.id].totalPagado += pago;
        acc[cliente.id].totalCompra += totalCompra;

        return acc;
      },
      {}
    );

    res.json(comprasAgrupadas);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "Hubo un error al obtener las compras" });
  }
};
