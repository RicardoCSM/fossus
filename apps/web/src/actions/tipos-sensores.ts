"use server";

import type { TipoSensorDto } from "@fossus/api-types";

import { actionError, type ActionResult } from "@/lib/action-result";
import http from "@/lib/http";

export async function fetchTiposSensorList(): Promise<ActionResult<TipoSensorDto[]>> {
  try {
    const response = await http.get<TipoSensorDto[]>("/tipos-sensores");
    return { success: true, data: response.data };
  } catch (e) {
    return actionError(e, "Erro ao buscar tipos de sensor.");
  }
}
