import { Metadata } from "next";
import PageLeaderboard from "./page";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Leaderboard | osu!Sunrise",
  openGraph: {
    title: "Leaderboard | osu!Sunrise",
  },
};

export default function Page() {
  return (
    <Suspense>
      <PageLeaderboard />
    </Suspense>
  );
}
