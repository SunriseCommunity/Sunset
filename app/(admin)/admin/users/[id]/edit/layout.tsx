import { Metadata } from "next";
import Page from "./page";
import { notFound } from "next/navigation";
import fetcher from "@/lib/services/fetcher";
import { UserResponse } from "@/lib/types/api";

export const revalidate = 60;

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const user = await fetcher<UserResponse>(`user/${params.id}`);

  if (!user) {
    return notFound();
  }

  return {
    title: `${user.username} · Admin User Preview | osu!sunrise`,
    description: `We don't know much about them, but we're sure ${user.username} is great.`,
    openGraph: {
      siteName: "osu!sunrise",
      title: `${user.username} · Admin User Preview | osu!sunrise`,
      description: `We don't know much about them, but we're sure ${user.username} is great.`,
      images: [
        `https://a.${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/avatar/${user.user_id}`,
      ],
    },
  };
}

export default Page;
