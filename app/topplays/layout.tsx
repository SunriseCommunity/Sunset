import { Metadata } from "next";
import TopPlaysPage from "./page";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Top Plays | osu!sunrise",
  openGraph: {
    title: "Top Plays | osu!sunrise",
  },
};

export default function Page() {
  return (
    <Suspense>
      <TopPlaysPage />
    </Suspense>
  );
}
