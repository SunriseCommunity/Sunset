"use client";
import { Music2 } from "lucide-react";
import Image from "next/image";
import { use } from "react";

import PrettyHeader from "@/components/General/PrettyHeader";
import RoundedContent from "@/components/General/RoundedContent";
import Spinner from "@/components/Spinner";
import { useBeatmap } from "@/lib/hooks/api/beatmap/useBeatmap";
import { useT } from "@/lib/i18n/utils";
import { tryParseNumber } from "@/lib/utils/type.util";

interface BeatmapsProps {
  params: Promise<{ id: string }>;
}

export default function BeatmapsRedirect(props: BeatmapsProps) {
  const t = useT("pages.beatmaps.detail");
  const params = use(props.params);
  const beatmapQuery = useBeatmap(tryParseNumber(params.id) ?? 0);
  const beatmap = beatmapQuery.data;

  if (beatmap) {
    window.location.href = `/beatmapsets/${beatmap.beatmapset_id}/${params.id}`;
  }

  if (beatmapQuery.error) {
    return (
      <main className="container mx-auto my-8">
        <PrettyHeader
          icon={<Music2 />}
          text={t("header")}
          className="mb-4 bg-terracotta-700"
          roundBottom={true}
        />
        <RoundedContent className="flex flex-col items-center justify-between gap-8 rounded-l bg-terracotta-700 md:flex-row md:items-start ">
          <div className="flex flex-col space-y-2">
            <h1 className="text-4xl">{t("notFound.title")}</h1>
            <p className="text-muted-foreground">{t("notFound.description")}</p>
          </div>
          <Image
            src="/images/user-not-found.png"
            alt="404"
            width={200}
            height={400}
            className="max-w-fit"
          />
        </RoundedContent>
      </main>
    );
  }

  return (
    <div className="flex h-full min-h-96 items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}
