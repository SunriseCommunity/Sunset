import { toLocalTime } from "@/lib/utils/toLocalTime";

export default function toPrettyDate(input: string | Date) {
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  return toLocalTime(input).toLocaleDateString("en-US", options);
}
