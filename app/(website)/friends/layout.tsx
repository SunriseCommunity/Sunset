import type { Metadata } from "next";

import { getT } from "@/lib/i18n/utils";

import Page from "./page";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT("pages.friends.meta");
  return {
    title: t("title"),
    openGraph: {
      title: t("title"),
    },
  };
}

export default Page;
