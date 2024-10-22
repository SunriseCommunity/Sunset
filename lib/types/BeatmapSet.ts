import { BeatmapStatus } from "@/lib/types/BeatmapStatus";
import { Beatmap } from "./Beatmap";

export interface BeatmapSet {
  id: number;
  artist: string;
  title: string;
  creator: string;
  creator_id: number;
  status: BeatmapStatus;
  last_updated: string;
  submitted_date: string;
  ranked_date?: string;
  video: boolean;
  beatmaps: Beatmap[];
}
