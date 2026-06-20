import axios from "axios";

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; message: string; errors?: Record<string, string> };

export function actionError(e: unknown, fallback: string): ActionResult<never> {
  if (axios.isAxiosError<{ message?: string }>(e)) {
    return { success: false, message: e.response?.data?.message ?? fallback };
  }

  console.error(e);
  return { success: false, message: fallback };
}

export function zodIssuesToErrors(
  issues: { path: PropertyKey[]; message: string }[],
): Record<string, string> {
  return issues.reduce<Record<string, string>>((acc, issue) => {
    acc[issue.path.join(".") || "_"] = issue.message;
    return acc;
  }, {});
}
