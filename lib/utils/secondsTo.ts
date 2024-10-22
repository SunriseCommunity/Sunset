export function SecondsToString(s: number): string {
  const date = new Date(s * 1000);
  let hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  const seconds = date.getUTCSeconds().toString().padStart(2, "0");
  if (hours === "00") {
    hours = "";
  } else {
    hours += ":";
  }
  return `${hours}${minutes}:${seconds}`;
}
