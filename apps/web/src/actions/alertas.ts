"use server";

import type { AlertaDto, PaginatedResult } from "@fossus/api-types";

import { actionError, type ActionResult, zodIssuesToErrors } from "@/lib/action-result";
import http from "@/lib/http";
import {
  type AlertaInput,
  alertaSchema,
  type UpdateAlertaInput,
  updateAlertaSchema,
} from "@/schemas/alertas";

export async function fetchAlertasList(
  page = 1,
  limit = 50,
): Promise<ActionResult<PaginatedResult<AlertaDto>>> {
  try {
    const response = await http.get<PaginatedResult<AlertaDto>>("/alertas", {
      params: { page, limit },
    });
    return { success: true, data: response.data };
  } catch (e) {
    return actionError(e, "Erro ao buscar alertas.");
  }
}

export async function fetchAlertasByBueiro(
  bueiroId: number,
  page = 1,
  limit = 50,
): Promise<ActionResult<PaginatedResult<AlertaDto>>> {
  try {
    const response = await http.get<PaginatedResult<AlertaDto>>(`/alertas/bueiro/${bueiroId}`, {
      params: { page, limit },
    });
    return { success: true, data: response.data };
  } catch (e) {
    return actionError(e, "Erro ao buscar alertas do bueiro.");
  }
}

export async function fetchAlerta(id: number): Promise<ActionResult<AlertaDto>> {
  try {
    const response = await http.get<AlertaDto>(`/alertas/${id}`);
    return { success: true, data: response.data };
  } catch (e) {
    return actionError(e, "Erro ao buscar alerta.");
  }
}

export async function createAlerta(data: AlertaInput): Promise<ActionResult<AlertaDto>> {
  const parsed = alertaSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: "Dados inválidos", errors: zodIssuesToErrors(parsed.error.issues) };
  }

  try {
    const response = await http.post<AlertaDto>("/alertas", parsed.data);
    return { success: true, data: response.data };
  } catch (e) {
    return actionError(e, "Erro ao criar alerta.");
  }
}

export async function updateAlerta(
  id: number,
  data: UpdateAlertaInput,
): Promise<ActionResult<AlertaDto>> {
  const parsed = updateAlertaSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: "Dados inválidos", errors: zodIssuesToErrors(parsed.error.issues) };
  }

  try {
    const response = await http.put<AlertaDto>(`/alertas/${id}`, parsed.data);
    return { success: true, data: response.data };
  } catch (e) {
    return actionError(e, "Erro ao atualizar alerta.");
  }
}
