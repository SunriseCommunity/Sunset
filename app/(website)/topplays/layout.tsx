import type { Metadata } from "next";
import { Suspense } from "react";

import { getT } from "@/lib/i18n/utils";

import TopPlaysPage from "./page";

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
