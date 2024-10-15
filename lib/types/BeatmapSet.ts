import { Beatmap } from "./Beatmap";

export interface BeatmapSet {
  id: number;
  artist: string;
  title: string;
  creator: string;
  status: string;
  last_updated: string;
  ranked_date?: string;
  has_video: boolean;
  beatmaps: Beatmap[];
}
