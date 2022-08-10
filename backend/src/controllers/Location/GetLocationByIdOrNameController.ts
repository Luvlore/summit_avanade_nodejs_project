import { Request, Response } from "express";
import { prismaClient } from "../../database/prismaClient";

export default async function GetLocationById(req: Request, res: Response) {
  const { id } = req.params;

  const location = await prismaClient.location.findFirst({ where: { location_id: Number(id) } });

  if (!location) return res.status(404).json({ message: 'location not found' });

  return res.status(200).json(location);
}
