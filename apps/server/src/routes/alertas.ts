import { Router } from "express";
import * as alertaController from "../controllers/alertas";

export const alertasRouter = Router();

alertasRouter.get("/", alertaController.list);
alertasRouter.get("/bueiro/:bueiroId", alertaController.findByBueiroId);
alertasRouter.get("/:id", alertaController.getById);
alertasRouter.post("/", alertaController.create);
alertasRouter.put("/:id", alertaController.update);
