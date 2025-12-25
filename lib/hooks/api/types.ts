import { GameMode } from "@/lib/types/api";

export const GameModesArray = ["osu!", "osu!taiko", "osu!catch", "osu!mania"];

export const GameRuleFlags: Partial<Record<GameMode, Record<string, GameMode | null>>> = {
  [GameMode.STANDARD]: {
    Standard: GameMode.STANDARD,
    Relax: GameMode.RELAX_STANDARD,
    Autopilot: GameMode.AUTOPILOT_STANDARD,
    ScoreV2: GameMode.SCORE_V2_STANDARD,
  },
  [GameMode.TAIKO]: {
    Standard: GameMode.TAIKO,
    Relax: GameMode.RELAX_TAIKO,
    Autopilot: null,
    ScoreV2: GameMode.SCORE_V2_TAIKO,
  },
  [GameMode.CATCH_THE_BEAT]: {
    Standard: GameMode.CATCH_THE_BEAT,
    Relax: GameMode.RELAX_CATCH_THE_BEAT,
    Autopilot: null,
    ScoreV2: GameMode.SCORE_V2_CATCH_THE_BEAT,
  },
  [GameMode.MANIA]: {
    Standard: GameMode.MANIA,
    Relax: null,
    Autopilot: null,
    ScoreV2: GameMode.SCORE_V2_MANIA,
  },
};

export const GameModeToFlagMap: Partial<Record<GameMode, string>> = {};

for (const baseMode in GameRuleFlags) {
  const flags = GameRuleFlags[baseMode as GameMode];
  if (!flags)
    continue;

  for (const [flag, mode] of Object.entries(flags)) {
    if (mode !== null) {
      GameModeToFlagMap[mode] = flag;
    }
  }
}

export const GameRuleFlagsShort: Partial<Record<GameMode, Record<string, GameMode | null>>> = {
  [GameMode.STANDARD]: {
    STD: GameMode.STANDARD,
    RX: GameMode.RELAX_STANDARD,
    AP: GameMode.AUTOPILOT_STANDARD,
    V2: GameMode.SCORE_V2_STANDARD,
  },
  [GameMode.TAIKO]: {
    STD: GameMode.TAIKO,
    RX: GameMode.RELAX_TAIKO,
    AP: null,
    V2: GameMode.SCORE_V2_TAIKO,
  },
  [GameMode.CATCH_THE_BEAT]: {
    STD: GameMode.CATCH_THE_BEAT,
    RX: GameMode.RELAX_CATCH_THE_BEAT,
    AP: null,
    V2: GameMode.SCORE_V2_CATCH_THE_BEAT,
  },
  [GameMode.MANIA]: {
    STD: GameMode.MANIA,
    RX: null,
    AP: null,
    V2: GameMode.SCORE_V2_MANIA,
  },
};

export const GameRulesGameModes: Partial<Record<GameMode, Record<string, GameMode | null>>> = {
  [GameMode.STANDARD]: {
    "osu!": GameMode.STANDARD,
    "osu!taiko": GameMode.TAIKO,
    "osu!catch": GameMode.CATCH_THE_BEAT,
    "osu!mania": GameMode.MANIA,
  },
  [GameMode.RELAX_STANDARD]: {
    "osu!": GameMode.RELAX_STANDARD,
    "osu!taiko": GameMode.RELAX_TAIKO,
    "osu!catch": GameMode.RELAX_CATCH_THE_BEAT,
    "osu!mania": null,
  },
  [GameMode.AUTOPILOT_STANDARD]: {
    "osu!": GameMode.AUTOPILOT_STANDARD,
    "osu!taiko": null,
    "osu!catch": null,
    "osu!mania": null,
  },
  [GameMode.SCORE_V2_STANDARD]: {
    "osu!": GameMode.SCORE_V2_STANDARD,
    "osu!taiko": GameMode.SCORE_V2_TAIKO,
    "osu!catch": GameMode.SCORE_V2_CATCH_THE_BEAT,
    "osu!mania": GameMode.SCORE_V2_MANIA,
  },
};

export const GameModeToGameRuleMap: Partial<Record<GameMode, string>> = {};

for (const parentMode in GameRulesGameModes) {
  const modeMappings = GameRulesGameModes[parentMode as GameMode];
  if (!modeMappings)
    continue;

  for (const [key, value] of Object.entries(modeMappings)) {
    if (value !== null) {
      GameModeToGameRuleMap[value] = key;
    }
  }
}

export interface PossibleErrorResult<T> {
  data: T | null;
  error?: string;
}
