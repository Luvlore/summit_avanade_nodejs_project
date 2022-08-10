import { Router } from "express";
import { CreateTable, DeleteTable, GetTableById, GetTables, UpdateTable } from "../controllers/Table";

const tableRoute = Router();

tableRoute.post('/', CreateTable);
tableRoute.get('/', GetTables);
tableRoute.get('/:id', GetTableById);
tableRoute.put('/:id', UpdateTable);
tableRoute.delete('/:id', DeleteTable)

export { tableRoute };
