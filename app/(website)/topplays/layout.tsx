import { Metadata } from "next";
import TopPlaysPage from "./page";
import { Suspense } from "react";
import { getT } from "@/lib/i18n/utils";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT("pages.topplays.meta");
  return {
    title: t("title"),
    openGraph: {
      title: t("title"),
    },
  };
}

export default function Page() {
  return (
    <Suspense>
      <TopPlaysPage />
    </Suspense>
  );
}
