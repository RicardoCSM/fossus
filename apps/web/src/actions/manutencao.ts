"use server";

import type { ManutencaoDto } from "@fossus/api-types";

import { actionError, type ActionResult, zodIssuesToErrors } from "@/lib/action-result";
import http from "@/lib/http";
import {
  type ManutencaoInput,
  manutencaoSchema,
  type UpdateManutencaoInput,
  updateManutencaoSchema,
} from "@/schemas/manutencao";

export async function fetchManutencoesList(): Promise<ActionResult<ManutencaoDto[]>> {
  try {
    const response = await http.get<ManutencaoDto[]>("/manutencoes");
    return { success: true, data: response.data };
  } catch (e) {
    return actionError(e, "Erro ao buscar manutenções.");
  }
}

export async function fetchManutencao(id: number): Promise<ActionResult<ManutencaoDto>> {
  try {
    const response = await http.get<ManutencaoDto>(`/manutencoes/${id}`);
    return { success: true, data: response.data };
  } catch (e) {
    return actionError(e, "Erro ao buscar manutenção.");
  }
}

export async function createManutencao(
  bueiroId: number,
  data: ManutencaoInput,
): Promise<ActionResult<ManutencaoDto>> {
  const parsed = manutencaoSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      message: "Dados inválidos",
      errors: zodIssuesToErrors(parsed.error.issues),
    };
  }

  try {
    const response = await http.post<ManutencaoDto>(`/manutencoes/bueiro/${bueiroId}`, parsed.data);
    return { success: true, data: response.data };
  } catch (e) {
    return actionError(e, "Erro ao criar manutenção.");
  }
}

export async function updateManutencao(
  id: number,
  data: UpdateManutencaoInput,
): Promise<ActionResult<ManutencaoDto>> {
  const parsed = updateManutencaoSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      message: "Dados inválidos",
      errors: zodIssuesToErrors(parsed.error.issues),
    };
  }

  try {
    const response = await http.put<ManutencaoDto>(`/manutencoes/${id}`, parsed.data);
    return { success: true, data: response.data };
  } catch (e) {
    return actionError(e, "Erro ao atualizar manutenção.");
  }
}

export async function deleteManutencao(id: number): Promise<ActionResult<null>> {
  try {
    await http.delete(`/manutencoes/${id}`);
    return { success: true, data: null };
  } catch (e) {
    return actionError(e, "Erro ao remover manutenção.");
  }
}
