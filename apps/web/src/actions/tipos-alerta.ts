"use server";

import type { TipoAlertaDto } from "@fossus/api-types";

import { actionError, type ActionResult, zodIssuesToErrors } from "@/lib/action-result";
import http from "@/lib/http";
import {
  type TipoAlertaInput,
  tipoAlertaSchema,
  type UpdateTipoAlertaInput,
  updateTipoAlertaSchema,
} from "@/schemas/tipos-alerta";

export async function fetchTiposAlertaList(): Promise<ActionResult<TipoAlertaDto[]>> {
  try {
    const response = await http.get<TipoAlertaDto[]>("/tipos-alerta");
    return { success: true, data: response.data };
  } catch (e) {
    return actionError(e, "Erro ao buscar tipos de alerta.");
  }
}

export async function fetchTipoAlerta(id: number): Promise<ActionResult<TipoAlertaDto>> {
  try {
    const response = await http.get<TipoAlertaDto>(`/tipos-alerta/${id}`);
    return { success: true, data: response.data };
  } catch (e) {
    return actionError(e, "Erro ao buscar tipo de alerta.");
  }
}

export async function createTipoAlerta(
  data: TipoAlertaInput,
): Promise<ActionResult<TipoAlertaDto>> {
  const parsed = tipoAlertaSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: "Dados inválidos", errors: zodIssuesToErrors(parsed.error.issues) };
  }

  try {
    const response = await http.post<TipoAlertaDto>("/tipos-alerta", parsed.data);
    return { success: true, data: response.data };
  } catch (e) {
    return actionError(e, "Erro ao criar tipo de alerta.");
  }
}

export async function updateTipoAlerta(
  id: number,
  data: UpdateTipoAlertaInput,
): Promise<ActionResult<TipoAlertaDto>> {
  const parsed = updateTipoAlertaSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: "Dados inválidos", errors: zodIssuesToErrors(parsed.error.issues) };
  }

  try {
    const response = await http.put<TipoAlertaDto>(`/tipos-alerta/${id}`, parsed.data);
    return { success: true, data: response.data };
  } catch (e) {
    return actionError(e, "Erro ao atualizar tipo de alerta.");
  }
}

export async function deleteTipoAlerta(id: number): Promise<ActionResult<null>> {
  try {
    await http.delete(`/tipos-alerta/${id}`);
    return { success: true, data: null };
  } catch (e) {
    return actionError(e, "Erro ao remover tipo de alerta.");
  }
}
