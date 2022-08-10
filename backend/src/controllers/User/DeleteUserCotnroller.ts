import { prisma } from "@prisma/client";
import { Request, Response } from "express";
import { prismaClient } from "../../database/prismaClient";

export default async function DeleteUserController(req: Request, res: Response) {
  const { id } = req.params;
  const users = await prismaClient.user.findFirst({ where: { user_id: Number(id) } });

  if (!users) res.status(404).json({ message: 'user not found' });

  await prismaClient.user.delete({ where: { user_id: Number(id) } });

  return res.status(204).end();
}
