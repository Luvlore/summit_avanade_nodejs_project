import { Request, Response } from "express";
import { prismaClient } from "../../database/prismaClient";

export default async function GetUserByIdController(req: Request, res: Response) {
  const { id } = req.params;
  const users = await prismaClient.user.findFirst({ where: { user_id: Number(id) } });

  if (!users) return res.status(200).json({ message: 'user not found' });

  return res.status(200).json(users);
}
