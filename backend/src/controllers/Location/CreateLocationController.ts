import { Request, Response } from "express";
import { prismaClient } from "../../database/prismaClient";

export default async function CreateLocationController(req: Request, res: Response) {
  const { location_name } = req.body;
  const location = await prismaClient.location.create({ data: { location_name } });
  return res.status(200).json(location);
}
