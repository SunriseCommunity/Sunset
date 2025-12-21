import Cookies from "js-cookie";

export const playtimeToString = (playtime: number) => {
  const locale = Cookies.get("locale") || "en";

  const hours = Math.floor(playtime / 1000 / 3600);
  const minutes = Math.floor(((playtime / 1000) % 3600) / 60);
  const seconds = Math.floor((playtime / 1000) % 60);

  const parts: string[] = [];

  if (hours > 0) {
    const hourFormatter = new Intl.NumberFormat(locale, {
      style: "unit",
      unit: "hour",
      unitDisplay: "short",
    });
    parts.push(hourFormatter.format(hours));
  }

  if (minutes > 0) {
    const minuteFormatter = new Intl.NumberFormat(locale, {
      style: "unit",
      unit: "minute",
      unitDisplay: "short",
    });
    parts.push(minuteFormatter.format(minutes));
  }

  if (seconds > 0 || parts.length === 0) {
    const secondFormatter = new Intl.NumberFormat(locale, {
      style: "unit",
      unit: "second",
      unitDisplay: "short",
    });
    parts.push(secondFormatter.format(seconds));
  }

  const listFormatter = new Intl.ListFormat(locale, {
    style: "long",
    type: "conjunction",
  });

  return listFormatter.format(parts);
};
