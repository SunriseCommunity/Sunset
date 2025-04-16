import { GameMode } from "@/lib/hooks/api/types";
import { User } from "@/lib/hooks/api/user/types";

export interface Score {
  accuracy: number;
  beatmap_id: number;
  count_100: number;
  count_300: number;
  count_50: number;
  count_geki: number;
  count_katu: number;
  count_miss: number;
  game_mode: number;
  game_mode_extended: GameMode;
  grade: string;
  id: number;
  is_passed: boolean;
  leaderboard_rank: number;
  max_combo: number;
  mods?: string;
  is_perfect: boolean;
  performance_points: number;
  total_score: number;
  user_id: number;
  when_played: string;
  user: User;
  has_replay: boolean;
}
