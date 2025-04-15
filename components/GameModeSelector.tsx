import { Combobox } from "@/components/ComboBox";
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
import { twMerge } from "tailwind-merge";

interface GameModeSelectorProps extends React.HTMLAttributes<HTMLDivElement> {
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
  ...props
}: GameModeSelectorProps) {
  if (enabledModes) enrichEnabledModesWithGameModes(enabledModes);

  return (
    <div
      {...props}
      className={twMerge(
        `flex lg:place-content-between place-content-end ${
          includeGameModes && includeGameRules ? "w-full" : ""
        }`,
        props.className
      )}
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
              onClick={() => key != null && setActiveMode(key)}
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

      <div className="flex lg:hidden">
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
