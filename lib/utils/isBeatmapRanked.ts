import { Beatmap, BeatmapStatus } from "@/lib/hooks/api/beatmap/types";

// NOTE: Temporary fix for the backend not including approved as ranked
export function isBeatmapRanked(beatmap: Beatmap) {
  return (
    beatmap.status === BeatmapStatus.Ranked ||
    beatmap.status === BeatmapStatus.Approved
  );
}
