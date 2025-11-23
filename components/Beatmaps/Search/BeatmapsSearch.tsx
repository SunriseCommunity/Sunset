"use client";

import type React from "react";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, ChevronDown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BeatmapStatusWeb, GameMode } from "@/lib/types/api";

import { BeatmapsSearchFilters } from "@/components/Beatmaps/Search/BeatmapsSearchFilters";
import { useBeatmapsetSearch } from "@/lib/hooks/api/beatmap/useBeatmapsetSearch";
import { BeatmapSetCard } from "@/components/Beatmaps/BeatmapSetCard";
import { twMerge } from "tailwind-merge";
import BeatmapSetOverview from "@/app/(website)/user/[id]/components/BeatmapSetOverview";
import useDebounce from "@/lib/hooks/useDebounce";
import { Card, CardContent } from "@/components/ui/card";

export default function BeatmapsSearch({
  forceThreeGridCols = false,
}: {
  forceThreeGridCols?: boolean;
}) {
  const [modeFilter, setModeFilter] = useState<GameMode | null>(null);
  const [statusFilter, setStatusFilter] = useState<BeatmapStatusWeb[] | null>([
    BeatmapStatusWeb.RANKED,
    BeatmapStatusWeb.LOVED,
    BeatmapStatusWeb.APPROVED,
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const searchValue = useDebounce<string>(searchQuery, 450);

  const [showFilters, setShowFilters] = useState(false);
  const [searchByCustomStatus, setSearchByCustomStatus] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

  const { data, setSize, size, isLoading } = useBeatmapsetSearch(
    searchValue,
    searchByCustomStatus ? 12 : 24,
    statusFilter ?? undefined,
    modeFilter ?? undefined,
    searchByCustomStatus,
    {
      refreshInterval: 0,
      revalidateOnFocus: false,
      keepPreviousData: true,
    }
  );

  const beatmapsets = data?.flatMap((item) => item.sets);

  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");

  const handleShowMore = () => {
    setSize(size + 1);
  };

  const applyFilters = (filters: {
    mode: GameMode | null;
    status: BeatmapStatusWeb[] | null;
    searchByCustomStatus: boolean;
  }) => {
    let { mode, status, searchByCustomStatus } = filters;

    setModeFilter(mode);
    setStatusFilter(status ?? null);
    setSearchByCustomStatus(searchByCustomStatus);
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="flex flex-1 items-center space-x-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              disabled={searchByCustomStatus}
              type="search"
              placeholder="Search beatmaps..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            className="relative"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
            {(statusFilter != null || modeFilter != null) && (
              <div className="absolute bg-primary sm:-top-2 text-primary-foreground -top-2.5 sm:-left-2 -left-2.5 rounded-full w-6 h-6 flex items-center justify-center text-sm">
                {[statusFilter, modeFilter].filter((v) => v != null).length}
              </div>
            )}
          </Button>
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

      <div
        className="overflow-hidden transition-all duration-500 ease-in-out "
        style={{ maxHeight: showFilters ? "500px" : "0" }}
      >
        <div
          className={
            showFilters
              ? "opacity-100 scale-100 transition duration-500"
              : "opacity-0 scale-95 transition duration-300"
          }
        >
          <BeatmapsSearchFilters
            onApplyFilters={applyFilters}
            isLoading={!!isLoadingMore}
            defaultMode={modeFilter}
            defaultStatus={statusFilter}
            defaultSearchByCustomStatus={searchByCustomStatus}
          />
        </div>
      </div>

      <div className="space-y-4">
        <Tabs value={viewMode}>
          <TabsContent value="grid" className="m-0">
            <div
              className={twMerge(
                `grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 `,
                forceThreeGridCols ? "" : "xl:grid-cols-4"
              )}
            >
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
        {beatmapsets &&
          beatmapsets?.length >= (searchByCustomStatus ? 12 : 24) && (
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
  );
}
