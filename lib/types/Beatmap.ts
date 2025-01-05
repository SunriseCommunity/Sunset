import { BeatmapStatus } from "@/lib/types/BeatmapStatus";
import { GameMode } from "@/lib/types/GameMode";

export interface Beatmap {
  id: number;
  beatmapset_id: number;
  hash: string;
  version: string;
  status: BeatmapStatus;
  accuracy: number;
  ar: number;
  bpm: number;
  convert: boolean;
  count_circles: number;
  count_sliders: number;
  count_spinners: number;
  star_rating_osu: number;
  star_rating_taiko: number;
  star_rating_ctb: number;
  star_rating_mania: number;
  total_length: number;
  max_combo: number;
  cs: number;
  deleted_at?: string;
  drain: number;
  hit_length: number;
  is_scoreable: boolean;
  last_updated: string;
  mode_int: GameMode;
  ranked: number;
  title?: string;
  artist?: string;
  creator?: string; // NOTE: currently broken
  creator_id: number;
}
