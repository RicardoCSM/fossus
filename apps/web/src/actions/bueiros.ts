"use server";

import type { BueiroDashboardDto, BueiroDto } from "@fossus/api-types";

import { actionError, type ActionResult, zodIssuesToErrors } from "@/lib/action-result";
import http from "@/lib/http";
import {
  type BueiroInput,
  bueiroSchema,
  type UpdateBueiroInput,
  updateBueiroSchema,
} from "@/schemas/bueiros";

export async function fetchBueirosList(): Promise<ActionResult<BueiroDto[]>> {
  try {
    const response = await http.get<BueiroDto[]>("/bueiros");
    return { success: true, data: response.data };
  } catch (e) {
    return actionError(e, "Erro ao buscar bueiros.");
  }
}

export async function fetchBueiro(id: number): Promise<ActionResult<BueiroDto>> {
  try {
    const response = await http.get<BueiroDto>(`/bueiros/${id}`);
    return { success: true, data: response.data };
  } catch (e) {
    return actionError(e, "Erro ao buscar bueiro.");
  }
}

export async function fetchBueiroDashboard(id: number): Promise<ActionResult<BueiroDashboardDto>> {
  try {
    const response = await http.get<BueiroDashboardDto>(`/bueiros/${id}/dashboard`);
    return { success: true, data: response.data };
  } catch (e) {
    return actionError(e, "Erro ao buscar dashboard do bueiro.");
  }
}

export async function createBueiro(data: BueiroInput): Promise<ActionResult<BueiroDto>> {
  const parsed = bueiroSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      message: "Dados inválidos",
      errors: zodIssuesToErrors(parsed.error.issues),
    };
  }

  try {
    const response = await http.post<BueiroDto>("/bueiros", parsed.data);
    return { success: true, data: response.data };
  } catch (e) {
    return actionError(e, "Erro ao criar bueiro.");
  }
}

export async function updateBueiro(
  id: number,
  data: UpdateBueiroInput,
): Promise<ActionResult<BueiroDto>> {
  const parsed = updateBueiroSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      message: "Dados inválidos",
      errors: zodIssuesToErrors(parsed.error.issues),
    };
  }

  try {
    const response = await http.put<BueiroDto>(`/bueiros/${id}`, parsed.data);
    return { success: true, data: response.data };
  } catch (e) {
    return actionError(e, "Erro ao atualizar bueiro.");
  }
}

export async function deleteBueiro(id: number): Promise<ActionResult<null>> {
  try {
    await http.delete(`/bueiros/${id}`);
    return { success: true, data: null };
  } catch (e) {
    return actionError(e, "Erro ao remover bueiro.");
  }
}
