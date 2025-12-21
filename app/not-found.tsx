import WebsiteLayout from "@/app/(website)/layout";
import { Metadata } from "next";
import Image from "next/image";
import { getT } from "@/lib/i18n/utils";
import { getLocale } from "next-intl/server";

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
      <div className="flex items-center justify-center h-full flex-col space-y-4 my-20">
        <h1 className="text-4xl font-bold">{t("title")}</h1>
        <h3 className="text-2xl font-normal">{t("description")}</h3>
        <Image src="/images/not-found.jpg" alt="404" width={400} height={400} />
      </div>
    </WebsiteLayout>
  );
}
