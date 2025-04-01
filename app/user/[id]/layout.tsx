import { Metadata } from "next";
import Page from "./page";
import { notFound } from "next/navigation";
import fetcher from "@/lib/services/fetcher";
import { User } from "@/lib/hooks/api/user/types";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: { id: number };
}): Promise<Metadata> {
  const user = await fetcher<User>(`user/${params.id}`);

  if (!user) {
    return notFound();
  }

  return {
    title: `${user.username} · user profile | osu!Sunrise`,
    description: `We don't know much about them, but we're sure ${user.username} is great.`,
    openGraph: {
      siteName: "osu!Sunrise",
      title: `${user.username} · user profile | osu!Sunrise`,
      description: `We don't know much about them, but we're sure ${user.username} is great.`,
      images: [
        `https://a.${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/avatar/${user.user_id}`,
      ],
    },
  };
}

export default Page;
