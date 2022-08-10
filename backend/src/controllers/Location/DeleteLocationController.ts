import { Request, Response } from "express";
import { prismaClient } from "../../database/prismaClient";

export default async function DeleteLocationController(req: Request, res: Response) {
  const { id } = req.params;

  const { location } = prismaClient;

  const findLocation = await location.findUnique({ where: { location_id: Number(id) } });

  if (!findLocation) return res.status(404).json({ message: 'location not found' });

  await location.delete({ where: { location_id: Number(id) } });

  return res.status(204).end();
}
