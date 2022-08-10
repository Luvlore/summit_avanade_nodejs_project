import { Request, Response } from "express";
import { prismaClient } from "../../database/prismaClient";

export default async function GetTablesController(req: Request, res: Response) {
  const tables = await prismaClient.table.findMany();
  return res.status(200).json(tables);
}
