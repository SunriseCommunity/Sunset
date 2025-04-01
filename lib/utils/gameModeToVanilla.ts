import { GameMode } from "@/lib/hooks/api/types";

export function gameModeToVanilla(gameMode: GameMode) {
  return (gameMode % 4) as GameMode;
}
