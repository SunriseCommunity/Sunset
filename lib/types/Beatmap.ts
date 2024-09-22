export interface Beatmap {
  id: number;
  beatmapset_id: number;
  hash: string;
  version: string;
  accuracy: number;
  ar: number;
  bpm: number;
  convert: boolean;
  count_circles: number;
  count_sliders: number;
  count_spinners: number;
  cs: number;
  deleted_at?: string;
  drain: number;
  hit_length: number;
  is_scoreable: boolean;
  last_updated: string;
  mode_int: number;
  ranked: number;
  title?: string;
  artist?: string;
  creator?: string;
}
