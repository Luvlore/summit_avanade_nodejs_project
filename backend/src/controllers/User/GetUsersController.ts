import { Request, Response } from "express";
import { prismaClient } from "../../database/prismaClient";

export default async function GetUsersController(req: Request, res: Response) {
  const users = await prismaClient.user.findMany();
  return res.status(200).json(users);
}
