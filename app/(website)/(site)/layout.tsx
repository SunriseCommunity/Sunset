import { Metadata } from "next";
import Page from "./page";
import { getT } from "@/lib/i18n/utils";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT("pages.mainPage.meta");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default Page;
