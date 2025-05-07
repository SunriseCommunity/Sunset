import { Combobox } from "@/components/ComboBox";
import DifficultyIcon from "@/components/DifficultyIcon";
import { Button } from "@/components/ui/button";
import {
  GameRuleFlags,
  GameRuleFlagsShort,
  GameRulesGameModes,
} from "@/lib/hooks/api/types";
import { GameMode } from "@/lib/types/api";
import {
  gameModeToGamerule,
  gameModeToVanilla,
} from "@/lib/utils/gameMode.util";
import { Star } from "lucide-react";
import { twMerge } from "tailwind-merge";

const GameModesIcons = {
  0: GameMode.STANDARD,
  1: GameMode.TAIKO,
  2: GameMode.CATCH_THE_BEAT,
  3: GameMode.MANIA,
};

interface GameModeSelectorProps extends React.HTMLAttributes<HTMLDivElement> {
  activeMode: GameMode;
  setActiveMode: (mode: GameMode) => void;
  activeGameRule?: GameMode;
  setActiveGameRule?: (rule: GameMode) => void;
  enabledModes?: GameMode[];
  includeGameModes?: boolean;
  includeGameRules?: boolean;
  userDefaultGameMode?: GameMode;
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

  if (enabledModes?.includes(GameMode.STANDARD)) {
    pushModesToArray([
      GameMode.RELAX_STANDARD,
      GameMode.AUTOPILOT_STANDARD,
      GameMode.SCORE_V2_STANDARD,
    ]);
  }

  if (enabledModes?.includes(GameMode.CATCH_THE_BEAT)) {
    pushModesToArray([
      GameMode.RELAX_CATCH_THE_BEAT,
      GameMode.SCORE_V2_CATCH_THE_BEAT,
    ]);
  }

  if (enabledModes?.includes(GameMode.TAIKO)) {
    pushModesToArray([GameMode.RELAX_TAIKO, GameMode.SCORE_V2_TAIKO]);
  }

  if (enabledModes?.includes(GameMode.MANIA)) {
    pushModesToArray([GameMode.SCORE_V2_MANIA]);
  }
}

export default function GameModeSelector({
  activeMode,
  setActiveMode,
  enabledModes,
  includeGameModes = true,
  includeGameRules = true,
  mobileVariant = "icons",
  userDefaultGameMode,
  ...props
}: GameModeSelectorProps) {
  if (enabledModes) enrichEnabledModesWithGameModes(enabledModes);

  var defaultGameModeVanilla =
    userDefaultGameMode && gameModeToVanilla(userDefaultGameMode);

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
            {Object.entries(
              GameRuleFlags[gameModeToVanilla(activeMode)] ?? {}
            ).map(([mode, key]) => (
              <Button
                key={mode}
                className="relative px-3 py-1"
                onClick={() => key != null && setActiveMode(key)}
                variant={
                  key != null &&
                  gameModeToGamerule(activeMode) === gameModeToGamerule(key)
                    ? "default"
                    : "secondary"
                }
                disabled={
                  key === null || (enabledModes && !enabledModes.includes(key))
                }
              >
                {mode}
                {key === userDefaultGameMode && <DefaultGameModeStar />}
              </Button>
            ))}
          </div>
          {mobileVariant === "icons" && (
            <div className="flex space-x-2 lg:hidden">
              {Object.entries(
                GameRuleFlagsShort[gameModeToVanilla(activeMode)] ?? {}
              ).map(([mode, key]) => (
                <Button
                  key={mode}
                  onClick={() => key != null && setActiveMode(key)}
                  className="relative"
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
                  {key === userDefaultGameMode && <DefaultGameModeStar />}
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
              GameRulesGameModes[gameModeToGamerule(activeMode)] ?? {}
            ).map(([mode, key]) => (
              <Button
                key={mode}
                className="relative px-3 py-1"
                onClick={() => key != null && setActiveMode(key)}
                variant={activeMode === key ? "default" : "secondary"}
                disabled={
                  key === null || (enabledModes && !enabledModes.includes(key))
                }
              >
                {mode}
                {key && gameModeToVanilla(key) === defaultGameModeVanilla && (
                  <DefaultGameModeStar />
                )}
              </Button>
            ))}
          </div>
          {mobileVariant === "icons" && (
            <div className="flex space-x-2 lg:hidden">
              {Object.entries(
                GameRulesGameModes[gameModeToGamerule(activeMode)] ?? {}
              ).map(([mode, key], index) => (
                <Button
                  key={mode}
                  size="icon"
                  className="relative"
                  onClick={() => key != null && setActiveMode(key)}
                  variant={activeMode === key ? "default" : "secondary"}
                  disabled={
                    key === null ||
                    (enabledModes && !enabledModes.includes(key))
                  }
                >
                  <DifficultyIcon
                    gameMode={
                      GameModesIcons[index as keyof typeof GameModesIcons]
                    }
                  />
                  {key && gameModeToVanilla(key) === defaultGameModeVanilla && (
                    <DefaultGameModeStar />
                  )}
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
              setActiveMode(mode);
            }}
            values={Object.entries(GameMode)
              .filter(([key]) => isNaN(Number(key)))
              .map(([mode, key]) => {
                return {
                  label: `${key === userDefaultGameMode ? "★ " : ""}${key}`,
                  value: key.toString(),
                };
              })}
          />
        </div>
      )}
    </div>
  );
}

export function DefaultGameModeStar() {
  return (
    <div className="absolute sm:-top-2 -top-2.5 sm:-right-2 -right-2.5 bg-card rounded-full p-0.5">
      <Star className="h-2 w-2 fill-yellow-400 stroke-yellow-400" />
    </div>
  );
}
