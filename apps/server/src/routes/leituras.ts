import { Router } from "express";
import * as leiturasController from "../controllers/leituras"

export const leiturasRouter = Router()

leiturasRouter.get("/",leiturasController.list)
leiturasRouter.post("/",leiturasController.create)