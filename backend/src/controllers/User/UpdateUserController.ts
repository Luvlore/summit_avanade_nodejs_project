import { Request, Response } from "express";
import { prismaClient } from "../../database/prismaClient";

export default async function UpdateUserController(req: Request, res: Response) {
  const { id } = req.params;
  const { firstname, lastname, email, password, phone } = req.body;
  const allUsers = await prismaClient.user.findFirst({ where: { user_id: Number(id) } });

  if (!allUsers) return res.status(404).json({ message: 'user not found' });

  if (email) {
    const findByEmail = await prismaClient.user.findFirst({ where: { email } });
    if (findByEmail && findByEmail.user_id !== Number(id)) return res.status(400).json({ message: 'email already in use' });
  }

  const users = await prismaClient.user.update({
    where: { user_id: Number(id) },
    data: {
      firstname: firstname ? firstname : undefined,
      lastname: lastname ? lastname : undefined,
      email: email ? email : undefined,
      password: password ? password : undefined,
      phone: phone ? phone : undefined
    }
  });

  return res.status(200).json(users);
}
