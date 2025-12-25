"use client";
import { useState } from "react";

import { ModsSelector } from "@/app/(website)/beatmapsets/components/leaderboard/ModsSelector";
import { useScoreColumns } from "@/app/(website)/beatmapsets/components/leaderboard/ScoreColumns";
import { ScoreDataTable } from "@/app/(website)/beatmapsets/components/leaderboard/ScoreDataTable";
import ScoreLeaderboardData from "@/app/(website)/beatmapsets/components/ScoreLeaderboardData";
import { useBeatmapLeaderboard } from "@/lib/hooks/api/beatmap/useBeatmapLeaderboard";
import useSelf from "@/lib/hooks/useSelf";
import type { BeatmapResponse, GameMode } from "@/lib/types/api";
import { Mods } from "@/lib/types/api";
import { tryParseNumber } from "@/lib/utils/type.util";

interface BeatmapLeaderboardProps {
  beatmap: BeatmapResponse;
  mode: GameMode;
}

export default function BeatmapLeaderboard({
  beatmap,
  mode,
}: BeatmapLeaderboardProps) {
  const { self } = useSelf();
  const scoreColumns = useScoreColumns();

  const [preferedNumberOfScoresPerLeaderboard] = useState(() => {
    return localStorage.getItem("preferedNumberOfScoresPerLeaderboard");
  });

  const size = tryParseNumber(preferedNumberOfScoresPerLeaderboard) ?? 50;

  const [pagination, setPagination] = useState({
    pageIndex: 0, // ! NOTE: Not supported by backend
    pageSize: size,
  });

  const [mods, setMods] = useState<Mods[]>([]);

  const beatmapLeaderboardQuery = useBeatmapLeaderboard(
    beatmap.id,
    {
      mode,
      mods,
      limit: pagination.pageSize,
    },
    {
      keepPreviousData: true,
    },
  );

  const beatmapLeaderboard = beatmapLeaderboardQuery.data;

  const { scores, total_count } = beatmapLeaderboard ?? {
    scores: [],
    total_count: 0,
  };

  const userScore = scores.find(s => self && self.user_id === s.user_id); // TODO: Bad! Should call request to the backend, but there is no current route to get users PB, implement!

  return (
    <>
      <ModsSelector
        mode={mode}
        mods={mods}
        setMods={setMods}
        ignoreMods={[Mods.RELAX, Mods.RELAX2, Mods.SCORE_V2]}
      />
      {scores.length > 0 && userScore?.leaderboard_rank !== 1 && (
        <ScoreLeaderboardData score={scores[0]} beatmap={beatmap} />
      )}
      {self && userScore && (
        <ScoreLeaderboardData score={userScore} beatmap={beatmap} />
      )}
      <ScoreDataTable
        columns={scoreColumns}
        data={scores}
        beatmap={beatmap}
        gameMode={mode}
        pagination={pagination}
        totalCount={total_count}
        setPagination={setPagination}
      />
    </>
  );
}
