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
  mods: string;
  mods_int: ShortenedMods;
  is_perfect: boolean;
  performance_points: number;
  total_score: number;
  user_id: number;
  when_played: string;
  user: User;
  has_replay: boolean;
}

export enum ShortenedMods {
  NM = 0,
  NF = 1,
  EZ = 2,
  TD = 4,
  HD = 8,
  HR = 16,
  SD = 32,
  DT = 64,
  RX = 128,
  HT = 256,
  NC = 512,
  FL = 1024,
  AT = 2048,
  SO = 4096,
  AP = 8192, // Relax2 -> AutoPilot -> AP
  PF = 16384,
  K4 = 32768,
  K5 = 65536,
  K6 = 131072,
  K7 = 262144,
  K8 = 524288,
  FDIN = 1048576,
  RND = 2097152,
  CN = 4194304,
  TA = 8388608,
  K9 = 16777216,
  KCP = 33554432,
  K1 = 67108864,
  K3 = 134217728,
  K2 = 268435456,
  V2 = 536870912,
}
