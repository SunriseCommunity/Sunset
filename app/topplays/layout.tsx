import { Metadata } from "next";
import TopPlaysPage from "./page";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Top plays | osu!Sunrise",
  openGraph: {
    title: "Top plays | osu!Sunrise",
  },
};

export default function Page() {
  return (
    <Suspense>
      <TopPlaysPage />
    </Suspense>
  );
}
