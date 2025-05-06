import { GameMode } from "@/lib/types/api";

export function gameModeToVanilla(gameMode: GameMode) {
  return GameModeToVanilla[gameMode];
}

export function gameModeToGamerule(gameMode: GameMode) {
  return GameModeToGamerule[gameMode];
}

const GameModeToVanilla = {
  [GameMode.STANDARD]: GameMode.STANDARD,
  [GameMode.TAIKO]: GameMode.TAIKO,
  [GameMode.CATCH_THE_BEAT]: GameMode.CATCH_THE_BEAT,
  [GameMode.MANIA]: GameMode.MANIA,

  [GameMode.RELAX_STANDARD]: GameMode.STANDARD,
  [GameMode.RELAX_TAIKO]: GameMode.TAIKO,
  [GameMode.RELAX_CATCH_THE_BEAT]: GameMode.CATCH_THE_BEAT,

  [GameMode.AUTOPILOT_STANDARD]: GameMode.STANDARD,

  [GameMode.SCORE_V2_STANDARD]: GameMode.STANDARD,
  [GameMode.SCORE_V2_TAIKO]: GameMode.TAIKO,
  [GameMode.SCORE_V2_CATCH_THE_BEAT]: GameMode.CATCH_THE_BEAT,
  [GameMode.SCORE_V2_MANIA]: GameMode.MANIA,
};

const GameModeToGamerule = {
  [GameMode.STANDARD]: GameMode.STANDARD,
  [GameMode.TAIKO]: GameMode.STANDARD,
  [GameMode.CATCH_THE_BEAT]: GameMode.STANDARD,
  [GameMode.MANIA]: GameMode.STANDARD,
  [GameMode.RELAX_STANDARD]: GameMode.RELAX_STANDARD,
  [GameMode.RELAX_TAIKO]: GameMode.RELAX_STANDARD,
  [GameMode.RELAX_CATCH_THE_BEAT]: GameMode.RELAX_STANDARD,
  [GameMode.AUTOPILOT_STANDARD]: GameMode.AUTOPILOT_STANDARD,
  [GameMode.SCORE_V2_STANDARD]: GameMode.SCORE_V2_STANDARD,
  [GameMode.SCORE_V2_TAIKO]: GameMode.SCORE_V2_STANDARD,
  [GameMode.SCORE_V2_CATCH_THE_BEAT]: GameMode.SCORE_V2_STANDARD,
  [GameMode.SCORE_V2_MANIA]: GameMode.SCORE_V2_STANDARD,
};
