import { Router } from "express";
import * as bueiroController from "../controllers/bueiros";

export const bueiroRouter = Router();

bueiroRouter.get("/", bueiroController.list);
bueiroRouter.get("/:id", bueiroController.getById);
bueiroRouter.get("/:id/dashboard", bueiroController.dashboard);
bueiroRouter.post("/", bueiroController.create);
bueiroRouter.put("/:id", bueiroController.update);
bueiroRouter.delete("/:id", bueiroController.remove);
