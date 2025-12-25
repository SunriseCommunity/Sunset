"use client";
import { Music2 } from "lucide-react";
import Image from "next/image";
import { use } from "react";

import PrettyHeader from "@/components/General/PrettyHeader";
import RoundedContent from "@/components/General/RoundedContent";
import Spinner from "@/components/Spinner";
import { useBeatmap } from "@/lib/hooks/api/beatmap/useBeatmap";
import { tryParseNumber } from "@/lib/utils/type.util";

interface BeatmapsProps {
  params: Promise<{ id: string }>;
}

export default function BeatmapsRedirect(props: BeatmapsProps) {
  const params = use(props.params);
  const beatmapQuery = useBeatmap(tryParseNumber(params.id) ?? 0);
  const beatmap = beatmapQuery.data;

  if (beatmap) {
    window.location.href = `/admin/beatmapsets/${beatmap.beatmapset_id}/${params.id}`;
  }

  if (beatmapQuery.error) {
    const errorMessage = beatmapQuery.error?.message ?? "Beatmapset not found";

    return (
      <div className="flex w-full flex-col space-y-4">
        <PrettyHeader text="Beatmaps ranking" roundBottom icon={<Music2 />} />
        <RoundedContent className="flex flex-col items-center justify-between gap-8 rounded-l md:flex-row md:items-start ">
          <div className="flex flex-col space-y-2">
            <h1 className="text-4xl">{errorMessage}</h1>
            <p className="text-muted-foreground">
              The beatmap you are looking for does not exist or has been
              deleted.
            </p>
          </div>
          <Image
            src="/images/user-not-found.png"
            alt="404"
            width={200}
            height={400}
            className="max-w-fit"
          />
        </RoundedContent>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col space-y-4">
      <PrettyHeader text="Beatmaps ranking" roundBottom icon={<Music2 />} />
      <div className="flex h-full min-h-96 items-center justify-center">
        <Spinner size="lg" />
      </div>
    </div>
  );
}
