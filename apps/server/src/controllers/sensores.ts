import type { Request, Response } from "express";
import { createSensorSchema, updateSensorSchema } from "../schemas/sensores";
import * as sensorService from "../services/sensores";
import parseId from "@/lib/parseId";

export async function create(req: Request, res: Response) {
  const parsed = createSensorSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      message: "Dados inválidos",
      errors: parsed.error.issues,
    });
    return;
  }

  const sensor = await sensorService.create(parsed.data);

  res.status(201).json(sensor);
}

export async function update(req: Request, res: Response) {
  const id = Number(req.params.id);

  const data = updateSensorSchema.parse(req.body);

  const sensor = await sensorService.update(id, data);

  res.json(sensor);
}

export async function list(_req: Request, res: Response): Promise<void> {
  const sensores = await sensorService.findAll();
  res.json(sensores);
}

export async function remove(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);

  const sensor = await sensorService.remove(id);

  if (!sensor) {
    res.status(404).json({ message: "Sensor não encontrado." });
    return;
  }

  res.json(sensor);
}

export async function getById(req: Request, res: Response) {
  const id = Number(req.params.id);

  const sensor = await sensorService.findById(id);

  if (!sensor) {
    res.status(404).json({ message: "Sensor não encontrado" });
    return;
  }

  res.json(sensor);
}

export async function findByBueiroId(req: Request, res: Response): Promise<void> {
  const bueiroId = parseId(req.params.bueiroId);

  if (bueiroId === null) {
    res.status(400).json({ message: "ID do bueiro inválido" });
    return;
  }

  const sensores = await sensorService.findByBueiroId(bueiroId);
  res.json(sensores);
}
