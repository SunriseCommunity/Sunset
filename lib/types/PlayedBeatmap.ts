import { Beatmap } from "./Beatmap";

export interface PlayedBeatmap extends Beatmap {
  play_count: number;
}
