import type { Request, Response } from "express";
import * as manutencaoService from "../services/manutencao";
import { createManutencaoSchema, updateManutencaoSchema } from "../schemas/manutencao";
import parseId from "@/lib/parseId";

export async function list(_req: Request, res: Response): Promise<void> {
  const manutencoes = await manutencaoService.findAll();

  res.json(manutencoes);
}

export async function getById(req: Request, res: Response): Promise<void> {
  const id = parseId(req.params.id);

  if (id === null) {
    res.status(400).json({
      message: "ID inválido",
    });
    return;
  }

  const manutencao = await manutencaoService.findById(id);

  if (!manutencao) {
    res.status(404).json({
      message: "Manutenção não encontrada",
    });
    return;
  }

  res.json(manutencao);
}

export async function create(req: Request, res: Response): Promise<void> {
  const bueiroId = parseId(req.params.bueiroId);

  if (bueiroId === null) {
    res.status(400).json({
      message: "ID do bueiro inválido",
    });
    return;
  }

  const parsed = createManutencaoSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      message: "Dados inválidos",
      errors: parsed.error.issues,
    });
    return;
  }

  const manutencao = await manutencaoService.create(bueiroId, parsed.data.equipe_id, parsed.data);

  res.status(201).json(manutencao);
}

export async function update(req: Request, res: Response): Promise<void> {
  const id = parseId(req.params.id);

  if (id === null) {
    res.status(400).json({
      message: "ID inválido",
    });
    return;
  }

  const parsed = updateManutencaoSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      message: "Dados inválidos",
      errors: parsed.error.issues,
    });
    return;
  }

  const manutencao = await manutencaoService.update(id, parsed.data);

  if (!manutencao) {
    res.status(404).json({
      message: "Manutenção não encontrada",
    });
    return;
  }

  res.json(manutencao);
}

export async function remove(req: Request, res: Response): Promise<void> {
  const id = parseId(req.params.id);

  if (id === null) {
    res.status(400).json({
      message: "ID inválido",
    });
    return;
  }

  const manutencao = await manutencaoService.remove(id);

  if (!manutencao) {
    res.status(404).json({
      message: "Manutenção não encontrada",
    });
    return;
  }

  res.status(204).send();
}
