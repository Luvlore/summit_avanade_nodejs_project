import { Router } from "express";
import { CreateLocation, DeleteLocation, GetLocationByIdOrName, GetLocations, UpdateLocation } from "../controllers/Location";

const locationRoute = Router();

locationRoute.post('/', CreateLocation);
locationRoute.get('/', GetLocations);
locationRoute.get('/:id', GetLocationByIdOrName);
locationRoute.put('/:id', UpdateLocation);
locationRoute.delete('/:id', DeleteLocation);

export { locationRoute };
