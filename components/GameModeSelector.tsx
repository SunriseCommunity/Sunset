import PrettyButton from "@/components/General/PrettyButton";
import { GameMode } from "@/lib/types/GameMode";

interface GameModeSelectorProps {
  activeMode: GameMode;
  setActiveMode: (mode: GameMode) => void;
  enabledModes?: GameMode[];
}

const GameModes = {
  "osu!": GameMode.std,
  "osu!taiko": GameMode.taiko,
  "osu!catch": GameMode.catch,
  "osu!mania": GameMode.mania,
};

export default function GameModeSelector({
  activeMode,
  setActiveMode,
  enabledModes,
}: GameModeSelectorProps) {
  return (
    <div className="flex space-x-2">
      {Object.entries(GameModes).map(([mode, key]) => (
        <PrettyButton
          text={mode}
          key={key}
          className={`px-3 py-1 ${
            activeMode === key ? "bg-terracotta-400 text-white" : ""
          }`}
          onClick={() => setActiveMode(key)}
          disabled={enabledModes && !enabledModes.includes(key)}
        />
      ))}
    </div>
  );
}
