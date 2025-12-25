import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getT } from "@/lib/i18n/utils";
import fetcher from "@/lib/services/fetcher";
import type { UserResponse } from "@/lib/types/api";

import Page from "./page";

export const revalidate = 60;

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const user = await fetcher<UserResponse>(`user/${params.id}`);

  if (!user) {
    return notFound();
  }

  const t = await getT("pages.user.meta");

  return {
    title: t("title", { username: user.username }),
    description: t("description", { username: user.username }),
    openGraph: {
      siteName: "osu!sunrise",
      title: t("title", { username: user.username }),
      description: t("description", { username: user.username }),
      images: [
        `https://a.${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/avatar/${user.user_id}`,
      ],
    },
  };
}

export default Page;
