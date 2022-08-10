import { Request, Response } from "express";
import { prismaClient } from "../../database/prismaClient";

export default async function UpdateLocationController(req: Request, res: Response) {
  const { id } = req.params;
  const { location_name } = req.body;

  const findLocation = await prismaClient.location.findFirst({ where: { location_id: Number(id) } });

  if (!findLocation) return res.status(404)
    .json({ messade: 'location not found' });

  const location = await prismaClient.location.update({
    where: { location_id: Number(id) },
    data: { location_name: location_name ? location_name : undefined }
  });

  return res.status(200).json(location);
}
