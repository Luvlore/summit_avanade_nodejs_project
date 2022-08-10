import { Request, Response } from "express";
import { prismaClient } from "../../database/prismaClient";

export default async function GetTableByIdController(req: Request, res: Response) {
  const { id } = req.params;
  const table = await prismaClient.table.findFirst({ where: { table_id: Number(id) } });

  if (!table) return res.status(404).json({ message: 'table not found' });

  return res.status(200).json(table);
}
