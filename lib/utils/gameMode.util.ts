import { GameMode } from "@/lib/hooks/api/types";

export function gameModeToVanilla(gameMode: GameMode) {
  return (gameMode % 4) as GameMode;
}

export function gameModeToGamerule(gameMode: GameMode) {
  return Math.floor(gameMode / 4) as GameMode;
}

export function gameModeToPrettyString(gameMode: GameMode) {
  return GameMode[gameMode]
    .replace(/(relax|autopilot)/g, "$1!")
    .replace(/scorev2/g, "v2!")
    .replace(/^std$/gm, "standard");
}
