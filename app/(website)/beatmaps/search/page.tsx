"use client";

import { Search } from "lucide-react";

import BeatmapsSearch from "@/components/Beatmaps/Search/BeatmapsSearch";
import PrettyHeader from "@/components/General/PrettyHeader";
import { useT } from "@/lib/i18n/utils";

export default function Page() {
  const t = useT("pages.beatmaps.search");
  return (
    <div className="flex flex-col space-y-4">
      <PrettyHeader text={t("header")} roundBottom icon={<Search />} />
      <BeatmapsSearch forceThreeGridCols={true} />
    </div>
  );
}
