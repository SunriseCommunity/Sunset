"use client";
import { use } from "react";
import Spinner from "@/components/Spinner";
import { useBeatmap } from "@/lib/hooks/api/beatmap/useBeatmap";
import RoundedContent from "@/components/General/RoundedContent";
import Image from "next/image";
import PrettyHeader from "@/components/General/PrettyHeader";
import { Music2 } from "lucide-react";

interface BeatmapsProps {
  params: Promise<{ id: number }>;
}

export default function BeatmapsRedirect(props: BeatmapsProps) {
  const params = use(props.params);
  const beatmapQuery = useBeatmap(params.id);
  const beatmap = beatmapQuery.data;

  if (beatmap) {
    window.location.href = `/admin/beatmapsets/${beatmap.beatmapset_id}/${params.id}`;
  }

  if (beatmapQuery.error) {
    const errorMessage = beatmapQuery.error?.message ?? "Beatmapset not found";

    return (
      <div className="flex flex-col w-full space-y-4">
        <PrettyHeader text="Beatmaps ranking" roundBottom icon={<Music2 />} />
        <RoundedContent className="rounded-l flex flex-col md:flex-row justify-between items-center md:items-start gap-8 ">
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
    <div className="flex flex-col w-full space-y-4">
      <PrettyHeader text="Beatmaps ranking" roundBottom icon={<Music2 />} />
      <div className="flex justify-center items-center h-full min-h-96">
        <Spinner size="lg" />
      </div>
    </div>
  );
}
