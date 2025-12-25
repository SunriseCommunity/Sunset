export function isInstance<T extends object>(value: string, type: T): boolean {
  return Object.values(type).includes(value);
}

export function tryParseNumber(value: string | null) {
  return !value || Number.isNaN(Number(value)) ? undefined : Number(value);
}
