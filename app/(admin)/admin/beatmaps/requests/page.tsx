"use client";

import type React from "react";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, ChevronDown, Rocket, ChevronsUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { BeatmapsSearchFilters } from "@/components/Beatmaps/Search/BeatmapsSearchFilters";
import { useBeatmapsetSearch } from "@/lib/hooks/api/beatmap/useBeatmapsetSearch";
import { BeatmapSetCard } from "@/components/Beatmaps/BeatmapSetCard";
import { twMerge } from "tailwind-merge";
import BeatmapSetOverview from "@/app/(website)/user/[id]/components/BeatmapSetOverview";
import useDebounce from "@/lib/hooks/useDebounce";
import { Card, CardContent } from "@/components/ui/card";
import { useBeatmapSetGetHypedSets } from "@/lib/hooks/api/beatmap/useBeatmapSetHypedSets";
import PrettyHeader from "@/components/General/PrettyHeader";

export default function Page() {
  const [viewMode, setViewMode] = useState("grid");

  const { data, setSize, size, isLoading } = useBeatmapSetGetHypedSets();

  const beatmapsets = data?.flatMap((item) => item.sets);
  const totalCount =
    data?.find((item) => item.total_count !== undefined)?.total_count ?? 0;

  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");

  const handleShowMore = () => {
    setSize(size + 1);
  };

  return (
    <div className="flex flex-col w-full space-y-4">
      <PrettyHeader
        icon={<ChevronsUp />}
        text="Beatmap requests"
        roundBottom={true}
      />
      <div className="space-y-2">
        <div className="flex place-content-between items-centerflex-row">
          <div className="px-3 py-1 font-medium items-center flex bg-card shadow rounded-lg text-sm">
            Total requests: {totalCount}
          </div>
          <div className="flex items-center space-x-2">
            <Tabs
              defaultValue="grid"
              value={viewMode}
              onValueChange={setViewMode}
              className="h-9 "
            >
              <TabsList className="grid bg-card h-9 w-[120px] shadow grid-cols-2">
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
                {beatmapsets?.map((beatmapSet, i) => (
                  <BeatmapSetCard key={i} beatmapSet={beatmapSet} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="list" className="m-0">
              <Card className="p-4">
                <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 p-0">
                  {beatmapsets?.map((beatmapSet, i) => (
                    <BeatmapSetOverview key={i} beatmapSet={beatmapSet} />
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          {beatmapsets && beatmapsets?.length < totalCount && (
            <div className="flex justify-center mt-4">
              <Button
                onClick={handleShowMore}
                className="w-full md:w-1/2 flex items-center justify-center"
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
