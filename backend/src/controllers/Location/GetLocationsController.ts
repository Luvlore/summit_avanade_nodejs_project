import { Request, Response } from "express";
import { prismaClient } from "../../database/prismaClient";

export default async function GetLocationsController(req: Request, res: Response) {
  const locations = await prismaClient.location.findMany();
  return res.status(200).json(locations);
}
