import type { Request, Response } from "express";
import { createEquipeSchema, updateEquipeSchema } from "../schemas/equipes";
import * as equipeService from "../services/equipes";
import parseId from "@/lib/parseId";

export async function create(req: Request, res: Response): Promise<void> {
  const parsed = createEquipeSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      message: "Dados inválidos",
      errors: parsed.error.issues,
    });
    return;
  }

  const equipe = await equipeService.create(parsed.data);

  res.status(201).json(equipe);
}

export async function list(_req: Request, res: Response): Promise<void> {
  try {
    const equipes = await equipeService.findAll();
    res.json(equipes);
  } catch {
    res.status(500).json({ message: "Erro ao buscar equipes." });
  }
}

export async function getById(req: Request, res: Response): Promise<void> {
  const id = parseId(req.params.id);

  if (id === null) {
    res.status(400).json({ message: "ID inválido" });
    return;
  }

  const equipe = await equipeService.findById(id);

  if (!equipe) {
    res.status(404).json({ message: "equipe não encontrada." });
    return;
  }

  res.json(equipe);
}

export async function remove(req: Request, res: Response): Promise<void> {
  const id = parseId(req.params.id);

  if (id === null) {
    res.status(400).json({ message: "ID inválido" });
    return;
  }

  const equipe = await equipeService.remove(id);

  if (!equipe) {
    res.status(404).json({ message: "equipe não encontrada." });
    return;
  }

  res.json(equipe);
}

export async function update(req: Request, res: Response): Promise<void> {
  const id = parseId(req.params.id);

  if (id === null) {
    res.status(400).json({ message: "ID inválido" });
    return;
  }

  const parsed = updateEquipeSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      message: "Dados inválidos",
      errors: parsed.error.issues,
    });
    return;
  }

  const equipe = await equipeService.update(id, parsed.data);

  if (!equipe) {
    res.status(404).json({
      message: "Equipe não encontrada",
    });
    return;
  }

  res.json(equipe);
}
