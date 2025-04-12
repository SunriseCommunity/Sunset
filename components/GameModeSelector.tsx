import { Combobox } from "@/components/ComboBox";
import PrettyButton from "@/components/General/PrettyButton";
import { Button } from "@/components/ui/button";
import {
  GameMode,
  GameRuleFlags,
  GameRulesGameModes,
} from "@/lib/hooks/api/types";
import {
  gameModeToGamerule,
  gameModeToPrettyString,
} from "@/lib/utils/gameMode.util";

interface GameModeSelectorProps {
  activeMode: GameMode;
  setActiveMode: (mode: GameMode) => void;
  activeGameRule?: number;
  setActiveGameRule?: (rule: number) => void;
  enabledModes?: GameMode[];
  includeGameModes?: boolean;
  includeGameRules?: boolean;
}

function enrichEnabledModesWithGameModes(enabledModes: GameMode[]) {
  const pushModesToArray = (modes: GameMode[]) => {
    modes.forEach((mode) => {
      if (!enabledModes.includes(mode)) {
        enabledModes.push(mode);
      }
    });
  };

  if (enabledModes?.includes(GameMode.std)) {
    pushModesToArray([
      GameMode.relaxstd,
      GameMode.autopilotstd,
      GameMode.scorev2std,
    ]);
  }

  if (enabledModes?.includes(GameMode.catch)) {
    pushModesToArray([GameMode.relaxcatch, GameMode.scorev2catch]);
  }

  if (enabledModes?.includes(GameMode.taiko)) {
    pushModesToArray([
      GameMode.relaxtaiko,
      GameMode.scorev2taiko,
      GameMode.autopilotstd,
    ]);
  }

  if (enabledModes?.includes(GameMode.mania)) {
    pushModesToArray([GameMode.scorev2mania]);
  }
}

export default function GameModeSelector({
  activeMode,
  setActiveMode,
  enabledModes,
  includeGameModes = true,
  includeGameRules = true,
}: GameModeSelectorProps) {
  // if (enabledModes) enrichEnabledModesWithGameModes(enabledModes);

  return (
    <div
      className={`flex place-content-between ${
        includeGameModes && includeGameRules ? " w-full" : ""
      }`}
    >
      {includeGameRules && (
        <div className="hidden space-x-2 lg:flex">
          {Object.entries(GameRuleFlags).map(([mode, key]) => (
            <Button
              key={mode}
              className="px-3 py-1"
              onClick={() => setActiveMode(key)}
              variant={
                gameModeToGamerule(activeMode) === gameModeToGamerule(key)
                  ? "default"
                  : "secondary"
              }
            >
              {mode}
            </Button>
          ))}
        </div>
      )}

      {includeGameModes && (
        <div className="hidden space-x-2 lg:flex">
          {Object.entries(
            GameRulesGameModes[gameModeToGamerule(activeMode)]
          ).map(([mode, key]) => (
            <Button
              key={mode}
              className="px-3 py-1"
              onClick={() => key && setActiveMode(key)}
              variant={activeMode === key ? "default" : "secondary"}
              disabled={
                key === null || (enabledModes && !enabledModes.includes(key))
              }
            >
              {mode}
            </Button>
          ))}
        </div>
      )}

      <div className="flex ml-auto lg:hidden">
        <Combobox
          activeValue={activeMode.toString()}
          setActiveValue={(mode: any) => {
            setActiveMode(parseInt(mode));
          }}
          values={Object.entries(GameMode)
            .filter(([key]) => isNaN(Number(key)))
            .map(([mode, key]) => {
              return {
                label: gameModeToPrettyString(key as GameMode),
                value: key.toString(),
              };
            })}
        />
      </div>
    </div>
  );
}
