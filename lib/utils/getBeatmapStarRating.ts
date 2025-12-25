import type { BeatmapResponse } from "@/lib/types/api";
import { GameMode } from "@/lib/types/api";

export function getBeatmapStarRating(
  beatmap: BeatmapResponse,
  mode?: GameMode,
) {
  switch (mode ?? beatmap.mode) {
    case GameMode.STANDARD:
      return beatmap.star_rating_osu;
    case GameMode.TAIKO:
      return beatmap.star_rating_taiko;
    case GameMode.CATCH_THE_BEAT:
      return beatmap.star_rating_ctb;
    case GameMode.MANIA:
      return beatmap.star_rating_mania;
    default:
      return -1;
  }
}
