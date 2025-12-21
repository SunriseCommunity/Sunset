import { Metadata } from "next";
import Page from "./page";
import { getT } from "@/lib/i18n/utils";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT("pages.support.meta");
  return {
    title: t("title"),
    openGraph: {
      title: t("title"),
    },
  };
}

export default Page;
