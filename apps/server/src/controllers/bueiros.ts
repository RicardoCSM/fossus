import type { Request, Response } from "express";
import * as bueiroService from "../services/bueiros";
import { createBueiroSchema, updateBueiroSchema } from "../schemas/bueiros";
import parseId from "@/lib/parseId";

export async function list(_req: Request, res: Response): Promise<void> {
  const bueiros = await bueiroService.findAll();
  res.json(bueiros);
}

export async function getById(req: Request, res: Response): Promise<void> {
  const id = parseId(req.params.id);
  if (id === null) {
    res.status(400).json({ message: "ID inválido" });
    return;
  }

  const bueiro = await bueiroService.findById(id);
  if (!bueiro) {
    res.status(404).json({ message: "Bueiro não encontrado" });
    return;
  }

  res.json(bueiro);
}

export async function create(req: Request, res: Response): Promise<void> {
  const parsed = createBueiroSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Dados inválidos", errors: parsed.error.issues });
    return;
  }

  const bueiro = await bueiroService.create(parsed.data);
  res.status(201).json(bueiro);
}

export async function update(req: Request, res: Response): Promise<void> {
  const id = parseId(req.params.id);
  if (id === null) {
    res.status(400).json({ message: "ID inválido" });
    return;
  }

  const parsed = updateBueiroSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Dados inválidos", errors: parsed.error.issues });
    return;
  }

  const bueiro = await bueiroService.update(id, parsed.data);
  if (!bueiro) {
    res.status(404).json({ message: "Bueiro não encontrado" });
    return;
  }

  res.json(bueiro);
}

export async function remove(req: Request, res: Response): Promise<void> {
  const id = parseId(req.params.id);
  if (id === null) {
    res.status(400).json({ message: "ID inválido" });
    return;
  }

  const bueiro = await bueiroService.remove(id);
  if (!bueiro) {
    res.status(404).json({ message: "Bueiro não encontrado" });
    return;
  }

  res.status(204).send();
}
