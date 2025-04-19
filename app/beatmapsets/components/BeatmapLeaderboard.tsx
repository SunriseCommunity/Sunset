"use client";
import { GameMode } from "@/lib/hooks/api/types";
import { Beatmap } from "@/lib/hooks/api/beatmap/types";
import { useBeatmapLeaderboard } from "@/lib/hooks/api/beatmap/useBeatmapLeaderboard";
import { ScoreDataTable } from "@/app/beatmapsets/components/leaderboard/ScoreDataTable";
import { useState } from "react";
import { tryParseNumber } from "@/lib/utils/type.util";
import { useSearchParams } from "next/navigation";
import { scoreColumns } from "@/app/beatmapsets/components/leaderboard/ScoreColumns";

interface BeatmapLeaderboardProps {
  beatmap: Beatmap;
  mode: GameMode;
}

export default function BeatmapLeaderboard({
  beatmap,
  mode,
}: BeatmapLeaderboardProps) {
  const searchParams = useSearchParams();

  const size = tryParseNumber(searchParams.get("size")) ?? 50;

  const [pagination, setPagination] = useState({
    pageIndex: 0, // ! NOTE: Not supported by backend
    pageSize: size,
  });

  const beatmapLeaderboardQuery = useBeatmapLeaderboard(
    beatmap.id,
    mode,
    undefined,
    pagination.pageSize,
    {
      keepPreviousData: true,
    }
  );

  const beatmapLeaderboard = beatmapLeaderboardQuery.data;

  const { scores, total_count } = beatmapLeaderboard ?? {
    scores: [],
    total_count: 0,
  };

  return (
    <ScoreDataTable
      columns={scoreColumns}
      data={scores}
      beatmap={beatmap}
      gameMode={mode}
      pagination={pagination}
      totalCount={total_count}
      setPagination={setPagination}
    />
  );
}
