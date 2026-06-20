"use server";

import type { EquipeDto } from "@fossus/api-types";

import { actionError, type ActionResult, zodIssuesToErrors } from "@/lib/action-result";
import http from "@/lib/http";
import {
  type EquipeInput,
  equipeSchema,
  type UpdateEquipeInput,
  updateEquipeSchema,
} from "@/schemas/equipes";

export async function fetchEquipesList(): Promise<ActionResult<EquipeDto[]>> {
  try {
    const response = await http.get<EquipeDto[]>("/equipes");
    return { success: true, data: response.data };
  } catch (e) {
    return actionError(e, "Erro ao buscar equipes.");
  }
}

export async function fetchEquipe(id: number): Promise<ActionResult<EquipeDto>> {
  try {
    const response = await http.get<EquipeDto>(`/equipes/${id}`);
    return { success: true, data: response.data };
  } catch (e) {
    return actionError(e, "Erro ao buscar equipe.");
  }
}

export async function createEquipe(data: EquipeInput): Promise<ActionResult<EquipeDto>> {
  const parsed = equipeSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: "Dados inválidos", errors: zodIssuesToErrors(parsed.error.issues) };
  }

  try {
    const response = await http.post<EquipeDto>("/equipes", parsed.data);
    return { success: true, data: response.data };
  } catch (e) {
    return actionError(e, "Erro ao criar equipe.");
  }
}

export async function updateEquipe(
  id: number,
  data: UpdateEquipeInput,
): Promise<ActionResult<EquipeDto>> {
  const parsed = updateEquipeSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: "Dados inválidos", errors: zodIssuesToErrors(parsed.error.issues) };
  }

  try {
    const response = await http.put<EquipeDto>(`/equipes/${id}`, parsed.data);
    return { success: true, data: response.data };
  } catch (e) {
    return actionError(e, "Erro ao atualizar equipe.");
  }
}

export async function deleteEquipe(id: number): Promise<ActionResult<null>> {
  try {
    await http.delete(`/equipes/${id}`);
    return { success: true, data: null };
  } catch (e) {
    return actionError(e, "Erro ao remover equipe.");
  }
}
