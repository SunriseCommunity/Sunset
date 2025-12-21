export const AVAILABLE_LOCALES = ["en", "ru", "en-GB"] as const;

export const LOCALE_TO_COUNTRY: Record<string, string> = {
  en: "GB",
  ru: "RU",
  "en-GB": "OWO",
};

export const DISPLAY_NAMES_LOCALES: Record<string, string> = {
  "en-GB": "Engwish",
};
