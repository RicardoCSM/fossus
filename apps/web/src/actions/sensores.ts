"use server";

import type { SensorDto } from "@fossus/api-types";

import { actionError, type ActionResult, zodIssuesToErrors } from "@/lib/action-result";
import http from "@/lib/http";
import {
  type SensorInput,
  sensorSchema,
  type UpdateSensorInput,
  updateSensorSchema,
} from "@/schemas/sensores";

export async function fetchSensoresList(): Promise<ActionResult<SensorDto[]>> {
  try {
    const response = await http.get<SensorDto[]>("/sensores");
    return { success: true, data: response.data };
  } catch (e) {
    return actionError(e, "Erro ao buscar sensores.");
  }
}

export async function fetchSensor(id: number): Promise<ActionResult<SensorDto>> {
  try {
    const response = await http.get<SensorDto>(`/sensores/${id}`);
    return { success: true, data: response.data };
  } catch (e) {
    return actionError(e, "Erro ao buscar sensor.");
  }
}

export async function createSensor(data: SensorInput): Promise<ActionResult<SensorDto>> {
  const parsed = sensorSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: "Dados inválidos", errors: zodIssuesToErrors(parsed.error.issues) };
  }

  try {
    const response = await http.post<SensorDto>("/sensores", parsed.data);
    return { success: true, data: response.data };
  } catch (e) {
    return actionError(e, "Erro ao criar sensor.");
  }
}

export async function updateSensor(
  id: number,
  data: UpdateSensorInput,
): Promise<ActionResult<SensorDto>> {
  const parsed = updateSensorSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: "Dados inválidos", errors: zodIssuesToErrors(parsed.error.issues) };
  }

  try {
    const response = await http.put<SensorDto>(`/sensores/${id}`, parsed.data);
    return { success: true, data: response.data };
  } catch (e) {
    return actionError(e, "Erro ao atualizar sensor.");
  }
}

export async function deleteSensor(id: number): Promise<ActionResult<null>> {
  try {
    await http.delete(`/sensores/${id}`);
    return { success: true, data: null };
  } catch (e) {
    return actionError(e, "Erro ao remover sensor.");
  }
}
