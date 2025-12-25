"use client";

import { ChevronDown, ChevronsUp } from "lucide-react";
import type * as React from "react";
import { useState } from "react";

import BeatmapSetOverview from "@/app/(website)/user/[id]/components/BeatmapSetOverview";
import { BeatmapSetCard } from "@/components/Beatmaps/BeatmapSetCard";
import PrettyHeader from "@/components/General/PrettyHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBeatmapSetGetHypedSets } from "@/lib/hooks/api/beatmap/useBeatmapSetHypedSets";

export default function Page() {
  const [viewMode, setViewMode] = useState("grid");

  const { data, setSize, size, isLoading } = useBeatmapSetGetHypedSets();

  const beatmapsets = data?.flatMap(item => item.sets);
  const totalCount
    = data?.find(item => item.total_count !== undefined)?.total_count ?? 0;

  const isLoadingMore
    = isLoading || (size > 0 && data && data[size - 1] === undefined);

  const handleShowMore = () => {
    setSize(size + 1);
  };

  return (
    <div className="flex w-full flex-col space-y-4">
      <PrettyHeader
        icon={<ChevronsUp />}
        text="Beatmap requests"
        roundBottom={true}
      />
      <div className="space-y-2">
        <div className="items-centerflex-row flex place-content-between">
          <div className="flex items-center rounded-lg bg-card px-3 py-1 text-sm font-medium shadow">
            Total requests: {totalCount}
          </div>
          <div className="flex items-center space-x-2">
            <Tabs
              defaultValue="grid"
              value={viewMode}
              onValueChange={setViewMode}
              className="h-9 "
            >
              <TabsList className="grid h-9 w-[120px] grid-cols-2 bg-card shadow">
                <TabsTrigger value="grid">Grid</TabsTrigger>
                <TabsTrigger value="list">List</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <div className="space-y-4">
          <Tabs value={viewMode}>
            <TabsContent value="grid" className="m-0">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {beatmapsets?.map(beatmapSet => (
                  <BeatmapSetCard key={`beatmap-set-card-${beatmapSet.id}`} beatmapSet={beatmapSet} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="list" className="m-0">
              <Card className="p-4">
                <CardContent className="grid grid-cols-1 gap-4 p-0 sm:grid-cols-2">
                  {beatmapsets?.map(beatmapSet => (
                    <BeatmapSetOverview key={`beatmap-set-overview-${beatmapSet.id}`} beatmapSet={beatmapSet} />
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          {beatmapsets && beatmapsets?.length < totalCount && (
            <div className="mt-4 flex justify-center">
              <Button
                onClick={handleShowMore}
                className="flex w-full items-center justify-center md:w-1/2"
                isLoading={isLoadingMore}
                variant="secondary"
              >
                <ChevronDown />
                Show more
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
