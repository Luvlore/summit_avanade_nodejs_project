import { Request, Response } from "express";
import { prismaClient } from "../../database/prismaClient";

export default async function UpdataTableController(req: Request, res: Response) {
  const { id } = req.params;
  const { table_name, capacity, is_available } = req.body;

  const findTable = await prismaClient.table.findFirst({ where: { table_id: Number(id) } });
  if (!findTable) return res.status(404).json({ message: 'table not found' });

  const findByNameAndLocation = await prismaClient.table.findFirst({
    where: {
      AND: [
        { table_name },
        { location_id: findTable.location_id }
      ]
    }
  });

  if (findByNameAndLocation) return res.status(400).json({ message: 'table name already exists' });

  const table = await prismaClient.table.update({
    where: { table_id: Number(id) },
    data: {
      table_name: table_name ? table_name : undefined,
      capacity: capacity ? capacity : undefined,
      is_available: is_available !== null ? is_available : findTable.is_available,
    }
  });

  return res.status(200).json(table);
}
