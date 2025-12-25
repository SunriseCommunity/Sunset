export const AVAILABLE_LOCALES = [
  "en",
  "ru",
  "en-GB",
  "de",
  "ja",
  "zh-CN",
  "es",
  "fr",
  "uk",
] as const;

export const LOCALE_TO_COUNTRY: Record<string, string> = {
  "en": "GB",
  "ru": "RU",
  "en-GB": "OWO",
  "de": "DE",
  "ja": "JP",
  "zh-CN": "CN",
  "es": "ES",
  "fr": "FR",
  "uk": "UA",
};

export const DISPLAY_NAMES_LOCALES: Record<string, string> = {
  "en-GB": "Engwish",
  "zh-CN": "中文（简体）",
};
