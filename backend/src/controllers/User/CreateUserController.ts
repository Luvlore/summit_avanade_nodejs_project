import { Request, Response } from "express";
import { prismaClient } from "../../database/prismaClient";

export default async function CreateUserController(req: Request, res: Response) {
  const { firstname, lastname, email, password, phone } = req.body;
  const findByEmail = await prismaClient.user.findFirst({ where: { email } });

  if (findByEmail) return res.status(400).json({ message: 'email already in use' });

  const users = await prismaClient.user.create({
    data: {
      firstname,
      lastname,
      email,
      password,
      phone
    }
  });

  return res.status(200).json(users);
}
