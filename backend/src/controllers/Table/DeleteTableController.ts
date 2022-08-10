import { Request, Response } from "express";
import { prismaClient } from "../../database/prismaClient";

export default async function DeleteTableController(req: Request, res: Response) {
  const { id } = req.params;

  const table = prismaClient.table;

  if (!await table.findUnique({ where: { table_id: Number(id) } })) return res.status(404)
    .json({ message: 'table not found' });

  await table.delete({ where: { table_id: Number(id) } });

  return res.status(204).end();
}
