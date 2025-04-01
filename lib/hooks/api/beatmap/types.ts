import { GameMode } from "@/lib/hooks/api/types";

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
  creator?: string;
  creator_id: number;
}

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
  description: string;
  genre: string;
  language: string;
  tags: string[];
}

export enum BeatmapStatus {
  Loved = "loved",
  Qualified = "qualified",
  Approved = "approved",
  Ranked = "ranked",
  Pending = "pending",
  Graveyard = "graveyard",
  WIP = "wip",
}

export interface PlayedBeatmap extends Beatmap {
  play_count: number;
}
