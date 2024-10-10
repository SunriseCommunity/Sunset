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
