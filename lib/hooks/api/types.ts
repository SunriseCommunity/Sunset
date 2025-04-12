export const GameModesArray = ["osu!", "osu!taiko", "osu!catch", "osu!mania"];

export enum GameMode {
  "std" = 0,
  "taiko" = 1,
  "catch" = 2,
  "mania" = 3,

  "relaxstd" = 4,
  "relaxtaiko" = 5,
  "relaxcatch" = 6,

  "autopilotstd" = 8,

  "scorev2std" = 12,
  "scorev2taiko" = 13,
  "scorev2catch" = 14,
  "scorev2mania" = 15,
}

export const GameRuleFlags = {
  Standard: 0,
  Relax: 4,
  Autopilot: 8,
  ScoreV2: 12,
};

export const GameRulesGameModes: {
  [key: number]: { [key: string]: GameMode | null };
} = {
  0: {
    "osu!": GameMode.std,
    "osu!taiko": GameMode.taiko,
    "osu!catch": GameMode.catch,
    "osu!mania": GameMode.mania,
  },
  1: {
    "osu!": GameMode.relaxstd,
    "osu!taiko": GameMode.relaxtaiko,
    "osu!catch": GameMode.relaxcatch,
    "osu!mania": null,
  },
  2: {
    "osu!": GameMode.autopilotstd,
    "osu!taiko": null,
    "osu!catch": null,
    "osu!mania": null,
  },
  3: {
    "osu!": GameMode.scorev2std,
    "osu!taiko": GameMode.scorev2taiko,
    "osu!catch": GameMode.scorev2catch,
    "osu!mania": GameMode.scorev2mania,
  },
};

export interface PossibleErrorResult<T> {
  data: any;
  error?: string;
}
