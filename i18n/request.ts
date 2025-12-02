import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export default getRequestConfig(async () => {
  const store = await cookies();
  const selectedLocale = store.get("locale")?.value || "en";

  return {
    locale: selectedLocale,
    messages: (await import(`../messages/${selectedLocale}.json`)).default,
  };
});
