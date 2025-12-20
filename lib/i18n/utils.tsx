import {
  RichTranslationValues,
  TranslationValues,
  useTranslations,
} from "next-intl";
import { getTranslations } from "next-intl/server";
import { ReactNode } from "react";

export type TranslationKey = string;

export const defaultTags = {
  p: (chunks: ReactNode) => <p>{chunks}</p>,
  b: (chunks: ReactNode) => <b className="font-semibold">{chunks}</b>,
  i: (chunks: ReactNode) => <i className="italic">{chunks}</i>,
  code: (chunks: ReactNode) => <code className="text-primary">{chunks}</code>,
  br: () => <br />,
};

export function useT(namespace?: string) {
  const t = useTranslations(namespace);
  const appName = useTranslations("general")("appName");

  const plainT = (key: TranslationKey, values?: TranslationValues) =>
    t(key, { appName, ...values });

  const richT = (key: TranslationKey, values?: RichTranslationValues) =>
    t.rich(key, { ...defaultTags, appName, ...values });

  plainT.rich = richT;

  return plainT;
}

export async function getT(namespace?: string) {
  const t = await getTranslations(namespace);

  const appName = await getTranslations("general").then((t) => t("appName"));

  const plainT = (key: TranslationKey, values?: TranslationValues) =>
    t(key, { appName, ...values });

  const richT = (key: TranslationKey, values?: RichTranslationValues) =>
    t.rich(key, { ...defaultTags, appName, ...values });

  plainT.rich = richT;

  return plainT;
}
