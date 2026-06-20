import { Router } from "express";
import * as sensoresController from "../controllers/sensores";

export const sensoresRouter = Router();

sensoresRouter.post("/", sensoresController.create);
sensoresRouter.get("/", sensoresController.list);
sensoresRouter.put("/:id", sensoresController.update);
sensoresRouter.delete("/:id", sensoresController.remove);
sensoresRouter.get("/:id", sensoresController.getById);
