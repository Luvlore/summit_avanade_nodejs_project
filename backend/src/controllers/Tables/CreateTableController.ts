import { Request, Response } from "express";
import { prismaClient } from "../../database/prismaClient";

export default async function CreateTableController(req: Request, res: Response) {
  const { table_name, capacity, is_available, location } = req.body;

  let locations = await prismaClient.location.findFirst({ where: { location_name: location } });

  if (!locations) {
    locations = await prismaClient.location.create({
      data: {
        location_name: location
      }
    });
  }

  const findTable = await prismaClient.table.findFirst({
    where: {
      location_id: locations.location_id,
      table_name
    }
  });

  if (findTable) return res.status(400).json({ message: 'table already exists' });

  const table = await prismaClient.table.create({
    data: {
      table_name,
      capacity,
      is_available,
      location_id: locations.location_id
    }
  });

  return res.status(200).json(table);
}
