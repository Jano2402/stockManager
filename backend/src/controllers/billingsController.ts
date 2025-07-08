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

  // Validación 1: Parámetros requeridos
  if (!fechaInicio || !fechaFin) {
    res.status(400).json({ error: "Debe proporcionar fechaInicio y fechaFin" });
    return;
  }

  // Validación 2: Formato ISO de fechas
  const isDateValid = (date: string) => !isNaN(Date.parse(date));
  if (!isDateValid(String(fechaInicio)) || !isDateValid(String(fechaFin))) {
    res
      .status(400)
      .json({ error: "Formato de fecha inválido. Use YYYY-MM-DD" });
    return;
  }

  // Validación 3: fechaInicio <= fechaFin
  const startDate = new Date(String(fechaInicio));
  const endDate = new Date(String(fechaFin));
  if (startDate > endDate) {
    res.status(400).json({ error: "fechaInicio debe ser anterior a fechaFin" });
    return;
  }

  try {
    const compras = await prisma.compras.findMany({
      where: {
        fecha: {
          gte: new Date(`${fechaInicio}T00:00:00.000Z`),
          lte: new Date(`${fechaFin}T23:59:59.999Z`),
        },
      },
      include: {
        cliente: {
          select: {
            id: true,
            nombre: true,
            deuda: true, // Asegurar que este campo esté disponible
          },
        },
      },
      orderBy: { fecha: "asc" },
    });

    // Validación 4: Comprobar si hay datos
    if (compras.length === 0) {
      res.status(404).json({ message: "No hay compras en el rango de fechas" });
      return;
    }

    // Agrupación con tipado seguro
    const comprasAgrupadas = compras.reduce<Record<number, CompraAgrupada>>(
      (acc, compra) => {
        if (!compra.cliente) {
          console.warn(`Compra sin cliente: ID ${compra.id}`);
          return acc; // Saltar compras sin cliente
        }

        const clienteId = compra.cliente.id;
        const { sifones, bidones_6l, bidones_12l, totalCompra, pago } = compra;

        if (!acc[clienteId]) {
          acc[clienteId] = {
            nombre: compra.cliente.nombre,
            sifones: 0,
            bidon6L: 0,
            bidon12L: 0,
            totalPagado: 0,
            totalCompra: 0,
            totalDebiendo: compra.cliente.deuda,
          };
        }

        // Sumar valores (evitando NaN)
        acc[clienteId].sifones += sifones || 0;
        acc[clienteId].bidon6L += bidones_6l || 0;
        acc[clienteId].bidon12L += bidones_12l || 0;
        acc[clienteId].totalPagado += pago || 0;
        acc[clienteId].totalCompra += totalCompra || 0;

        return acc;
      },
      {}
    );

    res.json(Object.values(comprasAgrupadas)); // Convertir a array
  } catch (error: any) {
    console.error("Error en getPurchasesByDates:", error);

    // Manejo de errores específicos de Prisma
    if (error.code === "P2025") {
      res.status(404).json({ error: "Datos relacionados no encontrados" });
    } else {
      res.status(500).json({
        error: "Error al obtener compras",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }
};
