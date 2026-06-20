import type { Request, Response } from "express";
import * as tipoSensorService from "../services/tipos-sensores";

export async function list(
  _req: Request,
  res: Response,
): Promise<void> {
  const tiposSensor = await tipoSensorService.findAll();

  res.json(tiposSensor);
}