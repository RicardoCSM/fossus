import { Router } from "express";
import * as tiposSensorController from "../controllers/tipos-sensores";

export const tiposSensorRouter = Router();

tiposSensorRouter.get("/", tiposSensorController.list);