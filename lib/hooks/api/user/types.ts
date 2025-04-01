import { GameMode } from "@/lib/hooks/api/types";

export type UserGrades = {
  count_xh: number;
  count_x: number;
  count_sh: number;
  count_s: number;
  count_a: number;
  count_b: number;
  count_c: number;
  count_d: number;
};

export type UserBadge =
  | "admin"
  | "supporter"
  | "bat"
  | "developer"
  | "bot"
  | "champion"
  | "restricted";

export interface User {
  user_id: number;
  username: string;
  description?: string;
  country_code: string;
  register_date: string;
  avatar_url: string;
  banner_url: string;
  last_online_time: string;
  restricted: boolean;
  silenced_until?: string;
  user_status: string;
  badges: UserBadge[];
}

export interface UserStats {
  user_id: number;
  gamemode: GameMode;
  accuracy: number;
  total_score: number;
  ranked_score: number;
  play_count: number;
  pp: number;
  max_combo: number;
  play_time: number;
  rank: number;
  country_rank: number;
  best_global_rank: number;
  best_global_rank_date: string;
  best_country_rank: number;
  best_country_rank_date: string;
}

export type UserGraph = {
  snapshots: StatsSnapshot[];
  total_count: number;
};

export type UpdateUserFriendshipAction = "add" | "remove";

export interface UserMedals {
  hush_hush: { medals: UserMedal[] };
  beatmap_hunt: { medals: UserMedal[] };
  mod_introduction: { medals: UserMedal[] };
  skill: { medals: UserMedal[] };
}

export interface UserMedal {
  id: number;
  name: string;
  description: string;
  unlocked_at?: string;
}

export enum UserScoresType {
  "best",
  "recent",
  "top",
}

export enum UsersLeaderboardType {
  "pp",
  "score",
}

export type UserFileUpload = "avatar" | "banner";

export interface StatsSnapshot {
  country_rank: number;
  global_rank: number;
  pp: number;
  saved_at: string;
}
