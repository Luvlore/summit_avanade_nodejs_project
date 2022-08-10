import { Router } from "express";
import { CreateTable } from "../controllers/Tables";

const tableRoute = Router();

tableRoute.post('/', CreateTable);

export { tableRoute };
