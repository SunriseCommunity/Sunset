import { Metadata } from "next";
import Page from "./page"; 
import { notFound } from "next/navigation";
import { getUser } from "@/lib/actions/getUser";

export async function generateMetadata({ params }: { params: { id: number } }): Promise<Metadata> {
  const userObj = await getUser(params.id).then((user) => {
    if (user.error) {
      return notFound();
    } else {
      return {
        user: user.data!,
      };
    }
  });
  
  return {
    title: `${userObj.user.username} | osu!Sunrise`,
    description: `We don't know much about them, but we're sure ${userObj.user.username} is great.`,
    openGraph: {
      title: `${userObj.user.username} | osu!Sunrise`,
      description: `We don't know much about them, but we're sure ${userObj.user.username} is great.`,
      images: [`https://a.${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/avatar/${userObj.user.user_id}`],
    },
  }
}
 
export default Page;