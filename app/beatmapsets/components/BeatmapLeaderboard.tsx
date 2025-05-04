"use client";
import { useBeatmapLeaderboard } from "@/lib/hooks/api/beatmap/useBeatmapLeaderboard";
import { ScoreDataTable } from "@/app/beatmapsets/components/leaderboard/ScoreDataTable";
import { useState } from "react";
import { tryParseNumber } from "@/lib/utils/type.util";
import { scoreColumns } from "@/app/beatmapsets/components/leaderboard/ScoreColumns";
import ScoreLeaderboardData from "@/app/beatmapsets/components/ScoreLeaderboardData";
import useSelf from "@/lib/hooks/useSelf";
import { ModsSelector } from "@/app/beatmapsets/components/leaderboard/ModsSelector";
import { BeatmapResponse, GameMode, Mods } from "@/lib/types/api";

interface BeatmapLeaderboardProps {
  beatmap: BeatmapResponse;
  mode: GameMode;
}

export default function BeatmapLeaderboard({
  beatmap,
  mode,
}: BeatmapLeaderboardProps) {
  const { self } = useSelf();

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
      mode: mode,
      mods: mods,
      limit: pagination.pageSize,
    },
    {
      keepPreviousData: true,
    }
  );

  const beatmapLeaderboard = beatmapLeaderboardQuery.data;

  const { scores, total_count } = beatmapLeaderboard ?? {
    scores: [],
    total_count: 0,
  };

  const userScore = scores.find((s) => self && self.user_id === s.user_id); // TODO: Bad! Should call request to the backend, but there is no current route to get users PB, implement!

  return (
    <>
      <ModsSelector
        mode={mode}
        mods={mods}
        setMods={setMods}
        ignoreMods={[Mods.RELAX, Mods.RELAX2, Mods.SCORE_V2]}
      />
      {scores.length > 0 && userScore?.leaderboard_rank != 1 && (
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
