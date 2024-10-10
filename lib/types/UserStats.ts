export interface UserStats {
  user_id: number;
  gamemode: 0 | 1 | 2 | 3;
  accuracy: number;
  total_score: number;
  ranked_score: number;
  play_count: number;
  pp: number;
  max_combo: number;
  play_time: number;
  rank: number;
}
