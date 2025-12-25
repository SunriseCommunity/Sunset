export function buildQuery<T extends Record<string, any>>(
  query?: T,
  withPrefix = true,
): string {
  if (!query)
    return "";

  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null)
      continue;

    if (Array.isArray(value)) {
      for (const item of value) {
        if (item !== undefined && item !== null) {
          params.append(key, String(item));
        }
      }
    }
    else {
      params.append(key, String(value));
    }
  }

  const queryString = params.toString();
  return withPrefix && queryString ? `?${queryString}` : queryString;
}
