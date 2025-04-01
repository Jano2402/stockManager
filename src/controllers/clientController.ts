import { Request, Response } from "express";
import prisma from "../prisma/prisma";

const getProductPrices = async (): Promise<Record<string, number>> => {
  const productos = await prisma.productos.findMany({
    where: {
      nombre: {
        in: ["Sifones", "Bidones6l", "Bidones12l"],
      },
    },
    select: {
      nombre: true,
      precio: true,
    },
  });

  // Convertir productos en un objeto para acceso más fácil
  return productos.reduce(
    (map, p) => {
      map[p.nombre] = p.precio;
      return map;
    },
    {} as Record<string, number>
  );
};

export const initUser = async (req: Request, res: Response): Promise<void> => {
  const { nombre, telefono, deuda, cant_envases, cant_bidones } = req.body;
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
        cant_bidones,
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
  const { sifones, bidones_6l, bidones_12l, pago, devuelveBid, devuelveSif } =
    req.body;

  try {
    // Buscar si el cliente existe
    const client = await prisma.clientes.findUnique({
      where: { id: Number(id) },
    });
    if (!client) {
      res.status(404).json({ message: "Client not found" });
      return;
    }

    // Obtener los precios de los productos desde la base de datos
    // Convertir productos en un mapa para acceso más fácil
    const precios = await getProductPrices();

    // Calcular el total de la compra
    const totalCompra =
      sifones * (precios["Sifones"] || 0) +
      bidones_6l * (precios["Bidones6l"] || 0) +
      bidones_12l * (precios["Bidones12l"] || 0);

    // Calcular la nueva deuda correctamente
    const nuevaDeuda = client.deuda + totalCompra - pago;

    // Crear la compra con la deuda calculada
    const newPurchase = await prisma.compras.create({
      data: {
        cliente_id: Number(id),
        sifones,
        bidones_6l,
        bidones_12l,
        pago,
        deuda: nuevaDeuda,
      },
    });

    // Actualizar la deuda del cliente
    await prisma.clientes.update({
      where: { id: Number(id) },
      data: {
        deuda: nuevaDeuda,
        cant_envases: client.cant_envases + sifones - devuelveSif,
        cant_bidones: client.cant_bidones + bidones_12l - devuelveBid,
      },
    });

    res.status(201).json({ newPurchase });
  } catch (error: any) {
    console.error(error);
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
  const { nombre, telefono, deuda, cant_envases, cant_bidones } = req.body;
  try {
    const updatedClient = await prisma.clientes.update({
      where: { id: Number(id) },
      data: {
        nombre,
        telefono,
        deuda,
        cant_envases,
        cant_bidones,
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
  const { id } = req.params;
  const { sifones, bidones_12l, bidones_6l, pago, devuelveSif, devuelveBid } =
    req.body;

  try {
    const compra = await prisma.compras.findUnique({
      where: { id: Number(id) },
    });
    if (!compra) {
      res.status(404).json({ error: "Purchase not found" });
      return;
    }

    const client = await prisma.clientes.findUnique({
      where: { id: compra.cliente_id },
    });
    if (!client) {
      throw new Error("Client not found");
    }

    const precios = await getProductPrices();

    const total_original =
      compra.sifones * (precios["Sifones"] || 0) +
      compra.bidones_12l * (precios["Bidones12l"] || 0) +
      compra.bidones_6l * (precios["Bidones6l"] || 0);

    const total_nuevo =
      sifones * (precios["Sifones"] || 0) +
      bidones_12l * (precios["Bidones12l"] || 0) +
      bidones_6l * (precios["Bidones6l"] || 0);

    const nueva_deuda =
      client.deuda - total_original + total_nuevo - (pago - compra.pago);

    // 🛠 Ajustar correctamente la cantidad de envases y bidones
    const nueva_cant_envases =
      client.cant_envases -
      compra.sifones +
      sifones -
      devuelveSif +
      compra.devuelveSif;

    const nueva_cant_bidones =
      client.cant_bidones -
      compra.bidones_12l +
      bidones_12l -
      devuelveBid +
      compra.devuelveBid;

    const updatedCompra = await prisma.compras.update({
      where: { id: Number(id) },
      data: {
        sifones,
        bidones_12l,
        bidones_6l,
        pago,
        deuda: nueva_deuda,
        devuelveBid,
        devuelveSif,
      },
    });

    await prisma.clientes.update({
      where: { id: client.id },
      data: {
        deuda: nueva_deuda,
        cant_envases: nueva_cant_envases,
        cant_bidones: nueva_cant_bidones,
      },
    });

    res.json(updatedCompra);
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .json({ error: "There was an error modifying the purchase" });
  }
};

// Esta función debe ir en los routings de billings

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
