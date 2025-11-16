import { Metadata } from "next";
import { Suspense } from "react";
import AdminUsersSearchPage from "./page";

export const metadata: Metadata = {
  title: "Users Search | osu!sunrise",
  openGraph: {
    title: "Users Search | osu!sunrise",
  },
};

export default function Page() {
  return (
    <Suspense>
      <AdminUsersSearchPage />
    </Suspense>
  );
}
