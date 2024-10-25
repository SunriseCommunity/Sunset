import { Beatmap } from "@/lib/types/Beatmap";
import { GameMode } from "@/lib/types/GameMode";

export function getBeatmapStarRating(beatmap: Beatmap, mode?: GameMode) {
  switch (mode || beatmap.mode_int) {
    case 0:
      return beatmap.star_rating_osu;
    case 1:
      return beatmap.star_rating_taiko;
    case 2:
      return beatmap.star_rating_ctb;
    case 3:
      return beatmap.star_rating_mania;
    default:
      return -1;
  }
}
