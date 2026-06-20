"use server";

import type { LeituraDto, PaginatedResult } from "@fossus/api-types";

import { actionError, type ActionResult, zodIssuesToErrors } from "@/lib/action-result";
import http from "@/lib/http";
import { type LeituraInput, leituraSchema } from "@/schemas/leituras";

export async function fetchLeiturasList(
  page = 1,
  limit = 50,
): Promise<ActionResult<PaginatedResult<LeituraDto>>> {
  try {
    const response = await http.get<PaginatedResult<LeituraDto>>("/leituras", {
      params: { page, limit },
    });
    return { success: true, data: response.data };
  } catch (e) {
    return actionError(e, "Erro ao buscar leituras.");
  }
}

export async function createLeitura(data: LeituraInput): Promise<ActionResult<LeituraDto>> {
  const parsed = leituraSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: "Dados inválidos", errors: zodIssuesToErrors(parsed.error.issues) };
  }

  try {
    const response = await http.post<LeituraDto>("/leituras", parsed.data);
    return { success: true, data: response.data };
  } catch (e) {
    return actionError(e, "Erro ao criar leitura.");
  }
}
