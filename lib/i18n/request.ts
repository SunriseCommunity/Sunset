import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import defaultMessages from "./messages/en.json";
import { merge } from "lodash";

export default getRequestConfig(async () => {
  const store = await cookies();
  const selectedLocale = store.get("locale")?.value || "en";

  const messages = merge(
    {},
    defaultMessages,
    (await import(`./messages/${selectedLocale}.json`)).default
  );

  return {
    locale: selectedLocale,
    messages,
  };
});
