import Cookies from "js-cookie";

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

  const locale = Cookies.get("locale") || "en";

  return toLocalTime(input).toLocaleDateString(locale, options);
}
