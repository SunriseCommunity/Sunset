export function toLocalTime(input: string | Date) {
  const date = input instanceof Date ? input : new Date(input);
  const localDate = date;

  return new Date(localDate);
}
