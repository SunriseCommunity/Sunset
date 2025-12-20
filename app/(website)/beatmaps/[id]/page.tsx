"use client";
import { use } from "react";
import Spinner from "@/components/Spinner";
import { useBeatmap } from "@/lib/hooks/api/beatmap/useBeatmap";
import NotFound from "@/app/not-found";
import PrettyHeader from "@/components/General/PrettyHeader";
import RoundedContent from "@/components/General/RoundedContent";
import Image from "next/image";
import { Music2 } from "lucide-react";
import { tryParseNumber } from "@/lib/utils/type.util";

interface BeatmapsProps {
  params: Promise<{ id: string }>;
}

export default function BeatmapsRedirect(props: BeatmapsProps) {
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
          text="Beatmap info"
          className="bg-terracotta-700 mb-4"
          roundBottom={true}
        />
        <RoundedContent className="bg-terracotta-700 rounded-l flex flex-col md:flex-row justify-between items-center md:items-start gap-8 ">
          <div className="flex flex-col space-y-2">
            <h1 className="text-4xl">Beatmapset not found</h1>
            <p className="text-muted-foreground">
              The beatmapset you are looking for does not exist or has been
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
      </main>
    );
  }

  return (
    <div className="flex justify-center items-center h-full min-h-96">
      <Spinner size="lg" />
    </div>
  );
}
