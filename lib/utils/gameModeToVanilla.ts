import { GameMode } from "@/lib/types/GameMode";

export function gameModeToVanilla(gameMode: GameMode) {
  return (gameMode % 4) as GameMode;
}
