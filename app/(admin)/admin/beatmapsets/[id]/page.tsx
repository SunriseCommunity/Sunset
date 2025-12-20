"use client";
import { ArrowLeft, ExternalLink, Music2 } from "lucide-react";
import RoundedContent from "@/components/General/RoundedContent";
import { use } from "react";
import ImageWithFallback from "@/components/ImageWithFallback";
import PrettyDate from "@/components/General/PrettyDate";
import DownloadButtons from "@/app/(website)/beatmapsets/components/DownloadButtons";
import Spinner from "@/components/Spinner";
import Image from "next/image";
import { useBeatmapSet } from "@/lib/hooks/api/beatmap/useBeatmapSet";
import { useRouter } from "next/navigation";
import { BeatmapStatusWeb } from "@/lib/types/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { BeatmapsStatusTable } from "@/app/(admin)/admin/beatmapsets/components/BeatmapsStatusTable";
import { BeatmapSetEvents } from "@/app/(admin)/admin/beatmapsets/components/BeatmapSetEvents";
import PrettyHeader from "@/components/General/PrettyHeader";
import Link from "next/link";
import { tryParseNumber } from "@/lib/utils/type.util";

export interface BeatmapsetProps {
  params: Promise<{ id: string }>;
}

export default function AdminBeatmapset(props: BeatmapsetProps) {
  const params = use(props.params);
  const router = useRouter();

  const beatmapSetId = tryParseNumber(params.id) ?? 0;

  const beatmapsetQuery = useBeatmapSet(beatmapSetId);
  const beatmapSet = beatmapsetQuery.data;

  if (beatmapsetQuery.isLoading)
    return (
      <div className="flex flex-col w-full space-y-4">
        <PrettyHeader text="Beatmaps ranking" roundBottom icon={<Music2 />} />
        <div className="flex flex-col justify-center items-center h-96">
          <Spinner size="xl" />
        </div>
      </div>
    );

  const errorMessage =
    beatmapsetQuery?.error?.message ?? "Beatmapset not found";

  return (
    <div className="flex flex-col w-full space-y-4">
      <PrettyHeader text="Beatmaps ranking" roundBottom icon={<Music2 />} />
      <div className="flex flex-col space-y-4  h-full  w-full">
        <Button variant="outline" onClick={router.back} className="w-fit">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Beatmap List
        </Button>

        {beatmapSet ? (
          <>
            <div className="z-2 lg:h-64 relative rounded-lg p-0 border">
              <div className="bg-black/60 lg:px-6 md:p-4 p-2 rounded-lg h-full">
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <h3 className="text-3xl font-bold text-white">
                      {beatmapSet.title}
                    </h3>
                    <p className="text-gray-200 text-lg">{beatmapSet.artist}</p>
                  </div>

                  <div className="flex flex-col space-y-2 text-white">
                    <div className="flex flex-row items-center">
                      <ImageWithFallback
                        src={`https://a.ppy.sh/${beatmapSet.creator_id}`}
                        alt=""
                        width={48}
                        height={48}
                        className="rounded-lg object-contain bg-stone-800 max-h-12 max-w-12"
                        fallBackSrc="/images/placeholder.png"
                      />
                      <div className="flex flex-col ml-2 text-xs font-light">
                        <div className="flex items-center">
                          submitted by&nbsp;
                          <p className="font-bold">
                            {beatmapSet.creator || "Unknown"}
                          </p>
                        </div>
                        <div className="flex items-center">
                          submitted on&nbsp;
                          <PrettyDate
                            time={beatmapSet.submitted_date}
                            className="font-bold"
                          />
                        </div>
                        {beatmapSet.ranked_date &&
                          beatmapSet.status === BeatmapStatusWeb.RANKED && (
                            <div className="flex items-center">
                              ranked on&nbsp;
                              <PrettyDate
                                time={beatmapSet.ranked_date}
                                className="font-bold"
                              />
                            </div>
                          )}
                      </div>
                    </div>

                    <div className="flex flex-wrap flex-row items-center gap-2">
                      <DownloadButtons beatmapSet={beatmapSet} />

                      <Button variant="secondary" size="xl" asChild>
                        <Link href={`/beatmapsets/${beatmapSet.id}`}>
                          <ExternalLink />
                          Open on Sunrise
                        </Link>
                      </Button>

                      <Button variant="secondary" size="xl" asChild>
                        <Link
                          href={`https://osu.ppy.sh/beatmapsets/${beatmapSet.id}`}
                          
                        >
                          <ExternalLink />
                          Open on Bancho
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="-z-10 absolute inset-0 overflow-hidden rounded-lg">
                <ImageWithFallback
                  src={`https://assets.ppy.sh/beatmaps/${beatmapSet.id}/covers/cover@2x.jpg`}
                  alt="beatmap image"
                  fill={true}
                  objectFit="cover"
                  className="relative"
                  fallBackSrc="/images/unknown-beatmap-banner.jpg"
                />
              </div>
            </div>

            {/* Cards */}
            <div className="grid gap-4 grid-cols-3">
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Beatmap Status</CardTitle>
                  <CardDescription>
                    Update the status of individual beatmaps
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <BeatmapsStatusTable beatmapSet={beatmapSet} />
                </CardContent>
              </Card>

              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Beatmap Status Logs</CardTitle>
                  <CardDescription>Changes with this beatmaps</CardDescription>
                </CardHeader>
                <CardContent>
                  <BeatmapSetEvents beatmapSet={beatmapSet} />
                </CardContent>
              </Card>
            </div>
          </>
        ) : beatmapsetQuery?.error ? (
          <RoundedContent className="rounded-l flex flex-col md:flex-row justify-between items-center md:items-start gap-8 ">
            <div className="flex flex-col space-y-2">
              <h1 className="text-4xl">{errorMessage}</h1>
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
        ) : null}
      </div>
    </div>
  );
}
