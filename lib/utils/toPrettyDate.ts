import { toLocalTime } from "@/lib/utils/toLocalTime";

export default function toPrettyDate(input: string | Date, withTime?: boolean) {
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  if (withTime) {
    options.second = "numeric";
    options.minute = "numeric";
    options.hour = "numeric";
  }

  return toLocalTime(input).toLocaleDateString("en-US", options);
}
