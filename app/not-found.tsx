import WebsiteLayout from "@/app/(website)/layout";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Not Found | osu!sunrise",
  openGraph: {
    title: "Not Found | osu!sunrise",
    description: "The page you're looking for isn't here. Sorry.",
  },
};

export default function NotFound() {
  return (
    <WebsiteLayout>
      <div className="flex items-center justify-center h-full flex-col space-y-4 my-20">
        <h1 className="text-4xl font-bold">Not Found | 404</h1>
        <h3 className="text-2xl font-normal">
          What you're looking for isn't here. Sorry.
        </h3>
        <Image src="/images/not-found.jpg" alt="404" width={400} height={400} />
      </div>
    </WebsiteLayout>
  );
}
