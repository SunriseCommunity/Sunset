import type { Metadata } from "next";
import Image from "next/image";

import WebsiteLayout from "@/app/(website)/layout";
import { getT } from "@/lib/i18n/utils";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT("components.notFound.meta");
  return {
    title: t("title"),
    openGraph: {
      title: t("title"),
      description: t("description"),
    },
  };
}

export default async function NotFound() {
  const t = await getT("components.notFound");
  return (
    <WebsiteLayout>
      <div className="my-20 flex h-full flex-col items-center justify-center space-y-4">
        <h1 className="text-4xl font-bold">{t("title")}</h1>
        <h3 className="text-2xl font-normal">{t("description")}</h3>
        <Image src="/images/not-found.jpg" alt="404" width={400} height={400} />
      </div>
    </WebsiteLayout>
  );
}
