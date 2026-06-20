import { Router } from "express";
import * as equipeController from "../controllers/equipes";

export const equipeRouter = Router();

equipeRouter.post("/", equipeController.create);
equipeRouter.get("/", equipeController.list);
equipeRouter.get("/:id", equipeController.getById);
equipeRouter.put("/:id", equipeController.update);
equipeRouter.delete("/:id", equipeController.remove);
