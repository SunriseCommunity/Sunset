import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import defaultMessages from "./messages/en.json";
import { merge } from "lodash";

const hasContext = (value: any): value is { text: string; context: string } => {
  return typeof value === "object" && "text" in value && "context" in value;
};

const extractTextFromMessages = (messages: any, result: any = {}) => {
  Object.entries(messages).forEach(([key, value]) => {
    if (typeof value === "string") {
      result[key] = value;
    } else if (hasContext(value)) {
      result[key] = value.text;
    } else {
      result[key] = extractTextFromMessages(value);
    }
  });

  return result;
};

export default getRequestConfig(async () => {
  const store = await cookies();
  const selectedLocale = store.get("locale")?.value || "en";

  const rawMessages = merge(
    {},
    defaultMessages,
    (await import(`./messages/${selectedLocale}.json`)).default
  );

  const messages = extractTextFromMessages(rawMessages);

  return {
    locale: selectedLocale,
    messages,
  };
});
