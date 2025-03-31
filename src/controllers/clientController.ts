import { Request, Response } from "express";
import prisma from "../prisma/prisma";

export const initUser = async (req: Request, res: Response): Promise<void> => {
  const { nombre, telefono, deuda, cant_envases } = req.body;
  try {
    if (!nombre) {
      res.status(400).json({ message: "name is required" });
      return;
    }
    const nuevoCliente = await prisma.clientes.create({
      data: {
        nombre,
        telefono,
        deuda,
        cant_envases,
      },
    });
    res.status(201).json({ message: "Client created", nuevoCliente });
  } catch (error: any) {
    res.status(500).json({ error: "There was an error creating the client" });
  }
};

export const searchUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { nombre } = req.query;
  try {
    const clientes = await prisma.clientes.findMany({
      where: {
        nombre: {
          contains: String(nombre),
          mode: "insensitive",
        },
      },
    });

    res.json(clientes);
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "There was an error looking for the client" });
  }
};

export const addPurchase = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { sifones, bidones_6l, bidones_12l, pago, deuda } = req.body;
  try {
    // Verificamos si existe el cliente
    const client = await prisma.clientes.findUnique({
      where: { id: Number(id) },
    });
    if (!client) {
      res.status(404).json({ message: "Client not found" });
      return;
    }
    // Creamos la compra
    const newPurchase = await prisma.compras.create({
      data: {
        cliente_id: Number(id),
        sifones,
        bidones_6l,
        bidones_12l,
        pago,
        deuda,
      },
    });

    // Actualizar la deuda total del cliente
    await prisma.clientes.update({
      where: { id: Number(id) },
      data: {
        // Añadir una base de datos con productos, y una parte en la compra que guarde el precio de compra a la fecha para flexibilidad
        deuda: client.deuda + deuda - pago,
      },
    });
    res.status(201).json({ newPurchase });
  } catch (error: any) {
    res.status(500).json({ error: "There was an error creating the purchase" });
  }
};

export const deleteClient = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const deletedClient = await prisma.clientes.delete({
      where: { id: Number(id) },
    });
    if (deletedClient) {
      res.json({ message: "Client deleted successfully" });
    } else {
      res.status(404).json({ error: "Client not found" });
    }
  } catch (error: any) {
    res.status(500).json({ error: "There was an error deleting the client" });
  }
};

export const updateClient = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { nombre, telefono, deuda, cant_envases } = req.body;
  try {
    const updatedClient = await prisma.clientes.update({
      where: { id: Number(id) },
      data: {
        nombre,
        telefono,
        deuda,
        cant_envases,
      },
    });
    res.status(200).json({ updatedClient });
  } catch (error: any) {
    res.status(500).json({ error: "There was an error updating the client" });
  }
};

// Modificar una compra específica
export const modifyPurchase = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params; // ID de la compra a modificar
  const { sifones, bidones_12l, bidones_6l, pago } = req.body;

  try {
    // Buscar la compra por ID
    const compra = await prisma.compras.findUnique({
      where: { id: Number(id) },
    });

    if (!compra) {
      res.status(404).json({ error: "Purchase not found" });
      return;
    }

    // Buscar el cliente asociado a la compra
    const client = await prisma.clientes.findUnique({
      where: { id: compra.cliente_id },
    });

    if (!client) {
      throw new Error("Client not found");
    }

    // Calcular el monto total de la compra original y la nueva compra
    const total_original =
      compra.sifones * 10 + compra.bidones_12l * 20 + compra.bidones_6l * 15;
    const total_nuevo = sifones * 10 + bidones_12l * 20 + bidones_6l * 15;

    // Calcular la nueva deuda para el cliente
    const nueva_deuda = client.deuda - total_original + total_nuevo - pago;

    // Actualizar la compra
    const updatedCompra = await prisma.compras.update({
      where: { id: Number(id) },
      data: { sifones, bidones_12l, bidones_6l, pago, deuda: nueva_deuda },
    });

    // Actualizar la deuda del cliente
    await prisma.clientes.update({
      where: { id: client.id },
      data: { deuda: nueva_deuda },
    });

    // Responder con la compra actualizada
    res.json(updatedCompra);
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "There was an error modifying the purchase" });
  }
};
