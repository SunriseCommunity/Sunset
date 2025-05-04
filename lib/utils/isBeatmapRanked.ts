import { BeatmapResponse, BeatmapStatusSearch } from "@/lib/types/api";


// NOTE: Temporary fix for the backend not including approved as ranked
export function isBeatmapRanked(beatmap: BeatmapResponse) {
  return (
    beatmap.status === BeatmapStatusSearch.RANKED ||
    beatmap.status === BeatmapStatusSearch.APPROVED
  );
}
