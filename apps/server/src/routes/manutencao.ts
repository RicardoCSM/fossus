import { Router } from "express";
import * as manutencaoController from "../controllers/manutencao";

export const manutencaoRouter = Router();

manutencaoRouter.get("/", manutencaoController.list);
manutencaoRouter.get("/bueiro/:bueiroId", manutencaoController.findByBueiroId);
manutencaoRouter.get("/:id", manutencaoController.getById);
manutencaoRouter.post("/bueiro/:bueiroId", manutencaoController.create);
manutencaoRouter.put("/:id", manutencaoController.update);
manutencaoRouter.delete("/:id", manutencaoController.remove);
