"use client";
import { ArrowLeft, Download, ExternalLink } from "lucide-react";
import RoundedContent from "@/components/General/RoundedContent";
import { useEffect, useState, use, useCallback } from "react";
import ImageWithFallback from "@/components/ImageWithFallback";
import PrettyDate from "@/components/General/PrettyDate";
import DownloadButtons from "@/app/(website)/beatmapsets/components/DownloadButtons";
import Spinner from "@/components/Spinner";
import { gameModeToVanilla } from "@/lib/utils/gameMode.util";
import Image from "next/image";
import { useBeatmapSet } from "@/lib/hooks/api/beatmap/useBeatmapSet";
import { BeatmapDropdown } from "@/app/(website)/beatmapsets/components/BeatmapDropdown";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { isInstance, tryParseNumber } from "@/lib/utils/type.util";
import { BeatmapResponse, GameMode } from "@/lib/types/api";
import UserHoverCard from "@/components/UserHoverCard";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Badge } from "@/components/ui/badge";
import BeatmapStatusBadge from "@/components/BeatmapStatusBadge";
import { BeatmapsStatusTable } from "@/app/(admin)/admin/beatmapsets/components/beatmapsStatusTable";

export interface BeatmapsetProps {
  params: Promise<{ id: number }>;
}

export default function AdminBeatmapset(props: BeatmapsetProps) {
  const params = use(props.params);
  const router = useRouter();

  const beatmapSetId = params.id;

  const beatmapsetQuery = useBeatmapSet(beatmapSetId);
  const beatmapSet = beatmapsetQuery.data;

  if (beatmapsetQuery.isLoading)
    return (
      <div className="flex flex-col justify-center items-center h-96">
        <Spinner size="xl" />
      </div>
    );

  const errorMessage =
    beatmapsetQuery?.error?.message ?? "Beatmapset not found";

  return (
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
                      {beatmapSet.ranked_date && (
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

                    <Button
                      onClick={() =>
                        router.push(`/beatmapsets/${beatmapSet.id}`)
                      }
                      variant="secondary"
                      size="xl"
                    >
                      <ExternalLink />
                      Open on Sunrise
                    </Button>

                    <Button
                      onClick={() =>
                        router.push(
                          `https://osu.ppy.sh/beatmapsets/${beatmapSet.id}`
                        )
                      }
                      variant="secondary"
                      size="xl"
                    >
                      <ExternalLink />
                      Open on Bancho
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
                <p>TODO</p>
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
  );
}
