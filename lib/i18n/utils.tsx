"use client";
import {
  RichTranslationValues,
  TranslationValues,
  useTranslations,
} from "next-intl";
import { ReactNode } from "react";

export type TranslationKey = string;

export const defaultTags = {
  p: (chunks: ReactNode) => <p>{chunks}</p>,
  b: (chunks: ReactNode) => <b className="font-semibold">{chunks}</b>,
  i: (chunks: ReactNode) => <i className="italic">{chunks}</i>,
  code: (chunks: ReactNode) => (
    <code className="text-primary/80">{chunks}</code>
  ),
  br: () => <br />,
};

export function useT(namespace: string) {
  const t = useTranslations(namespace);
  const appName = useTranslations("general")("appName");

  const plainT = (key: TranslationKey, values?: TranslationValues) =>
    t(key, { appName, ...values });

  const richT = (key: TranslationKey, values?: RichTranslationValues) =>
    t.rich(key, { ...defaultTags, appName, ...values });

  plainT.rich = richT;

  return plainT;
}
