export function formatDateTime(iso: string | null) {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    const day = iso.slice(0, 10);
    const time = iso.slice(11, 16);
    return time ? `${day} ${time}` : day;
  }
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
    .toISOString();
  return `${local.slice(0, 10)} ${local.slice(11, 16)}`;
}

export function fromDateTimeLocal(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toISOString();
}
