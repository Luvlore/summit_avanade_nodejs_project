import { Router } from "express";
import { CreateUser, DeleteUser, GetUserById, GetUsers, UpdateUser } from "../controllers/User";

const userRoute = Router();

userRoute.post('/', CreateUser);
userRoute.get('/', GetUsers);
userRoute.get('/:id', GetUserById);
userRoute.put('/:id', UpdateUser);
userRoute.delete('/:id', DeleteUser);

export { userRoute };
