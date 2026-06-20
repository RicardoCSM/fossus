import { Router } from "express";
import * as tipoAlertaController from "../controllers/tipos-alerta";

export const tiposAlertaRouter = Router();

tiposAlertaRouter.get("/", tipoAlertaController.list);
tiposAlertaRouter.get("/:id", tipoAlertaController.getById);
tiposAlertaRouter.post("/", tipoAlertaController.create);
tiposAlertaRouter.put("/:id", tipoAlertaController.update);
tiposAlertaRouter.delete("/:id", tipoAlertaController.remove);
