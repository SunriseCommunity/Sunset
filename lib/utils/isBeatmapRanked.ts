import { Beatmap } from "@/lib/types/Beatmap";
import { BeatmapStatus } from "@/lib/types/BeatmapStatus";

// NOTE: Temporary fix for the backend not including approved as ranked
export function isBeatmapRanked(beatmap: Beatmap) {
  return (
    beatmap.status === BeatmapStatus.Ranked ||
    beatmap.status === BeatmapStatus.Approved
  );
}
