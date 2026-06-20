import type { Request, Response } from "express";
import * as tipoAlertaService from "../services/tipos-alerta";
import {
  createTipoAlertaSchema,
  updateTipoAlertaSchema,
} from "../schemas/tipos-alerta";
import parseId from "@/lib/parseId";

export async function list(_req: Request, res: Response): Promise<void> {
  const tiposAlerta = await tipoAlertaService.findAll();
  res.json(tiposAlerta);
}

export async function getById(req: Request, res: Response): Promise<void> {
  const id = parseId(req.params.id);

  if (id === null) {
    res.status(400).json({ message: "ID inválido" });
    return;
  }

  const tipoAlerta = await tipoAlertaService.findById(id);

  if (!tipoAlerta) {
    res.status(404).json({ message: "Tipo de alerta não encontrado" });
    return;
  }

  res.json(tipoAlerta);
}

export async function create(req: Request, res: Response): Promise<void> {
  const parsed = createTipoAlertaSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      message: "Dados inválidos",
      errors: parsed.error.issues,
    });
    return;
  }

  const tipoAlerta = await tipoAlertaService.create(parsed.data);
  res.status(201).json(tipoAlerta);
}

export async function update(req: Request, res: Response): Promise<void> {
  const id = parseId(req.params.id);

  if (id === null) {
    res.status(400).json({ message: "ID inválido" });
    return;
  }

  const parsed = updateTipoAlertaSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      message: "Dados inválidos",
      errors: parsed.error.issues,
    });
    return;
  }

  const tipoAlerta = await tipoAlertaService.update(id, parsed.data);

  if (!tipoAlerta) {
    res.status(404).json({ message: "Tipo de alerta não encontrado" });
    return;
  }

  res.json(tipoAlerta);
}

export async function remove(req: Request, res: Response): Promise<void> {
  const id = parseId(req.params.id);

  if (id === null) {
    res.status(400).json({ message: "ID inválido" });
    return;
  }

  const tipoAlerta = await tipoAlertaService.remove(id);

  if (!tipoAlerta) {
    res.status(404).json({ message: "Tipo de alerta não encontrado" });
    return;
  }

  res.status(204).send();
}
