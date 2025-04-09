import { Request, Response } from "express";
import prisma from "../prisma/prisma";

// Función auxiliar para obtener el precio de los productos
const getProductPrices = async (): Promise<Record<string, number>> => {
  try {
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

    if (productos.length === 0) {
      throw new Error("No se encontraron productos en la base de datos");
    }

    return productos.reduce(
      (map, p) => {
        map[p.nombre] = p.precio;
        return map;
      },
      {} as Record<string, number>
    );
  } catch (error) {
    console.error("Error en getProductPrices:", error);
    throw error; // Propaga el error para manejarlo en las funciones que llaman a esta
  }
};

export const initUser = async (req: Request, res: Response): Promise<void> => {
  const {
    nombre,
    telefono,
    deuda = 0,
    cant_envases = 0,
    cant_bidones = 0,
  } = req.body;

  // Validaciones
  if (!nombre || typeof nombre !== "string") {
    res.status(400).json({ error: "Nombre es requerido y debe ser texto" });
    return;
  }
  if (telefono && !/^\d+$/.test(telefono)) {
    res.status(400).json({ error: "Teléfono debe contener solo números" });
    return;
  }
  if (isNaN(deuda) || isNaN(cant_envases) || isNaN(cant_bidones)) {
    res.status(400).json({ error: "Campos numéricos inválidos" });
    return;
  }

  try {
    const nuevoCliente = await prisma.clientes.create({
      data: { nombre, telefono, deuda, cant_envases, cant_bidones },
    });
    res.status(201).json(nuevoCliente);
  } catch (error: any) {
    console.error("Error en initUser:", error);
    if (error.code === "P2002") {
      res.status(400).json({ error: "El cliente ya existe" }); // Si hay unique constraint
    } else {
      res.status(500).json({ error: "Error al crear cliente" });
    }
  }
};

export const searchUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { nombre } = req.query;

  if (typeof nombre !== "string") {
    res.status(400).json({ error: "Parámetro 'nombre' inválido" });
    return;
  }

  try {
    const clientes = await prisma.clientes.findMany({
      where: {
        nombre: { contains: nombre, mode: "insensitive" },
      },
    });
    res.json(clientes);
  } catch (error) {
    console.error("Error en searchUser:", error);
    res.status(500).json({ error: "Error al buscar clientes" });
  }
};

export const addPurchase = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const {
    sifones = 0,
    bidones_6l = 0,
    bidones_12l = 0,
    pago = 0,
    devuelveBid = 0,
    devuelveSif = 0,
  } = req.body;

  // Validaciones
  if (isNaN(Number(id))) {
    res.status(400).json({ error: "ID de cliente inválido" });
    return;
  }
  if (
    [sifones, bidones_6l, bidones_12l, pago, devuelveBid, devuelveSif].some(
      isNaN
    )
  ) {
    res.status(400).json({ error: "Todos los valores deben ser números" });
    return;
  }

  try {
    const client = await prisma.clientes.findUnique({
      where: { id: Number(id) },
    });
    if (!client) {
      res.status(404).json({ error: "Cliente no encontrado" });
      return;
    }

    const precios = await getProductPrices(); // Ahora propaga errores

    const totalCompra =
      sifones * (precios["Sifones"] || 0) +
      bidones_6l * (precios["Bidones6l"] || 0) +
      bidones_12l * (precios["Bidones12l"] || 0);

    const nuevaDeuda = client.deuda + totalCompra - pago;

    const newPurchase = await prisma.compras.create({
      data: {
        cliente_id: Number(id),
        sifones,
        bidones_6l,
        bidones_12l,
        devuelveBid,
        devuelveSif,
        totalCompra,
        pago,
        deuda: nuevaDeuda,
      },
    });

    await prisma.clientes.update({
      where: { id: Number(id) },
      data: {
        deuda: nuevaDeuda,
        cant_envases: client.cant_envases + sifones - devuelveSif,
        cant_bidones: client.cant_bidones + bidones_12l - devuelveBid,
      },
    });

    res.status(201).json(newPurchase);
  } catch (error: any) {
    console.error("Error en addPurchase:", error);
    if (error.message.includes("No se encontraron productos")) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Error al registrar compra" });
    }
  }
};

export const deleteClient = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  if (isNaN(Number(id))) {
    res.status(400).json({ error: "ID inválido" });
    return;
  }

  try {
    const deletedClient = await prisma.clientes.delete({
      where: { id: Number(id) },
    });
    res.json({ message: "Cliente eliminado", deletedClient });
  } catch (error: any) {
    console.error("Error en deleteClient:", error);
    if (error.code === "P2025") {
      res.status(404).json({ error: "Cliente no encontrado" });
    } else {
      res.status(500).json({ error: "Error al eliminar cliente" });
    }
  }
};

export const updateClient = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { nombre, telefono, deuda, cant_envases, cant_bidones } = req.body;

  if (isNaN(Number(id))) {
    res.status(400).json({ error: "ID inválido" });
    return;
  }
  if (nombre && typeof nombre !== "string") {
    res.status(400).json({ error: "Nombre debe ser texto" });
    return;
  }

  try {
    const updatedClient = await prisma.clientes.update({
      where: { id: Number(id) },
      data: { nombre, telefono, deuda, cant_envases, cant_bidones },
    });
    res.json(updatedClient);
  } catch (error: any) {
    console.error("Error en updateClient:", error);
    if (error.code === "P2025") {
      res.status(404).json({ error: "Cliente no encontrado" });
    } else {
      res.status(500).json({ error: "Error al actualizar cliente" });
    }
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

  // Validaciones
  if (isNaN(Number(id))) {
    res.status(400).json({ error: "ID de compra inválido" });
    return;
  }
  if (
    [sifones, bidones_12l, bidones_6l, pago, devuelveSif, devuelveBid].some(
      isNaN
    )
  ) {
    res.status(400).json({ error: "Todos los valores deben ser números" });
    return;
  }

  try {
    const compra = await prisma.compras.findUnique({
      where: { id: Number(id) },
    });
    if (!compra) {
      res.status(404).json({ error: "Compra no encontrada" });
      return;
    }

    const client = await prisma.clientes.findUnique({
      where: { id: compra.cliente_id },
    });
    if (!client) {
      res.status(404).json({ error: "Cliente no encontrado" });
      return;
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
