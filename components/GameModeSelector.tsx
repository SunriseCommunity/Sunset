import { Combobox } from "@/components/ComboBox";
import DifficultyIcon from "@/components/DifficultyIcon";
import { Button } from "@/components/ui/button";
import {
  GameMode,
  GameRuleFlags,
  GameRuleFlagsShort,
  GameRulesGameModes,
} from "@/lib/hooks/api/types";
import {
  gameModeToGamerule,
  gameModeToPrettyString,
  gameModeToVanilla,
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
  mobileVariant?: "combobox" | "icons";
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
  mobileVariant = "icons",
  ...props
}: GameModeSelectorProps) {
  if (enabledModes) enrichEnabledModesWithGameModes(enabledModes);

  return (
    <div
      {...props}
      className={twMerge(
        `flex lg:place-content-between`,
        includeGameModes && includeGameRules ? "w-full" : "",
        mobileVariant === "combobox"
          ? "place-content-end"
          : "place-content-between",
        props.className
      )}
    >
      {includeGameRules && (
        <>
          <div className="hidden space-x-2 lg:flex">
            {Object.entries(GameRuleFlags[gameModeToVanilla(activeMode)]).map(
              ([mode, key]) => (
                <Button
                  key={mode}
                  className="px-3 py-1"
                  onClick={() => key != null && setActiveMode(key)}
                  variant={
                    key != null &&
                    gameModeToGamerule(activeMode) === gameModeToGamerule(key)
                      ? "default"
                      : "secondary"
                  }
                  disabled={
                    key === null ||
                    (enabledModes && !enabledModes.includes(key))
                  }
                >
                  {mode}
                </Button>
              )
            )}
          </div>
          {mobileVariant === "icons" && (
            <div className="flex space-x-2 lg:hidden">
              {Object.entries(
                GameRuleFlagsShort[gameModeToVanilla(activeMode)]
              ).map(([mode, key]) => (
                <Button
                  key={mode}
                  onClick={() => key != null && setActiveMode(key)}
                  size="icon"
                  variant={
                    key != null &&
                    gameModeToGamerule(activeMode) === gameModeToGamerule(key)
                      ? "default"
                      : "secondary"
                  }
                  disabled={
                    key === null ||
                    (enabledModes && !enabledModes.includes(key))
                  }
                >
                  {mode}
                </Button>
              ))}
            </div>
          )}
        </>
      )}

      {includeGameModes && (
        <>
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
          {mobileVariant === "icons" && (
            <div className="flex space-x-2 lg:hidden">
              {Object.entries(
                GameRulesGameModes[gameModeToGamerule(activeMode)]
              ).map(([mode, key], index) => (
                <Button
                  key={mode}
                  size="icon"
                  onClick={() => key != null && setActiveMode(key)}
                  variant={activeMode === key ? "default" : "secondary"}
                  disabled={
                    key === null ||
                    (enabledModes && !enabledModes.includes(key))
                  }
                >
                  {<DifficultyIcon gameMode={index} />}
                </Button>
              ))}
            </div>
          )}
        </>
      )}

      {mobileVariant === "combobox" && (
        <div className="flex lg:hidden flex-col">
          <p className="text-secondary-foreground text-sm lg:hidden flex">
            Selected mode:
          </p>
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
      )}
    </div>
  );
}
