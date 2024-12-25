export function timeSince(input: string | Date, forceDays = false) {
  const date = input instanceof Date ? input : new Date(input);
  const userTimezoneOffset = getUserTimezoneOffset();

  date.setHours(date.getHours() + userTimezoneOffset);

  const formatter = new Intl.RelativeTimeFormat("en");
  const ranges: { [key: string]: number } = {
    years: 3600 * 24 * 365,
    months: 3600 * 24 * 30,
    weeks: 3600 * 24 * 7,
    days: 3600 * 24,
    hours: 3600,
    minutes: 60,
    seconds: 1,
  };
  const secondsElapsed = (date.getTime() - Date.now()) / 1000;

  if (forceDays) {
    if (Math.abs(secondsElapsed) < ranges["days"]) {
      return "Today";
    }

    const delta = secondsElapsed / ranges["days"];
    return formatter.format(Math.round(delta), "days");
  }

  for (let key in ranges) {
    if (ranges[key] < Math.abs(secondsElapsed)) {
      const delta = secondsElapsed / ranges[key];
      return formatter.format(Math.round(delta), key as any);
    }
  }
}

function getUserTimezoneOffset() {
  const offsetMinutes = new Date().getTimezoneOffset();
  const offsetHours = -offsetMinutes / 60;
  return offsetHours;
}
