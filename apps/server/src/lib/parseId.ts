export default function parseId(raw: string | string[] | undefined): number | null {
  if (!raw || Array.isArray(raw)) return null;
  const id = Number(raw);
  return Number.isNaN(id) ? null : id;
}
