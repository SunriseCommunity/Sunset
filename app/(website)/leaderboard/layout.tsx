import { Metadata } from "next";
import PageLeaderboard from "./page";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Leaderboard | osu!sunrise",
  openGraph: {
    title: "Leaderboard | osu!sunrise",
  },
};

export default function Page() {
  return (
    <Suspense>
      <PageLeaderboard />
    </Suspense>
  );
}
