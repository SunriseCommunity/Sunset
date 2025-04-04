import PrettyButton from "@/components/General/PrettyButton";
import { GameMode } from "@/lib/hooks/api/types";
import { useEffect, useState } from "react";

interface GameModeSelectorProps {
  activeMode: GameMode;
  setActiveMode: (mode: GameMode) => void;
  activeGameRule?: number;
  setActiveGameRule?: (rule: number) => void;
  enabledModes?: GameMode[];
  includeGameModes?: boolean;
  includeGameRules?: boolean;
}

export const GameRuleFlags = {
  Standard: 0,
  Relax: 4,
  Autopilot: 8,
  ScoreV2: 12,
};

const AllowedGameModes: { [key: number]: { [key: string]: GameMode | null } } =
  {
    0: {
      "osu!": GameMode.std,
      "osu!taiko": GameMode.taiko,
      "osu!catch": GameMode.catch,
      "osu!mania": GameMode.mania,
    },
    4: {
      "osu!": GameMode.relaxstd,
      "osu!taiko": GameMode.relaxtaiko,
      "osu!catch": GameMode.relaxcatch,
      "osu!mania": null,
    },
    8: {
      "osu!": GameMode.autopilotstd,
      "osu!taiko": null,
      "osu!catch": null,
      "osu!mania": null,
    },
    12: {
      "osu!": GameMode.scorev2std,
      "osu!taiko": GameMode.scorev2taiko,
      "osu!catch": GameMode.scorev2catch,
      "osu!mania": GameMode.scorev2mania,
    },
  };

export default function GameModeSelector({
  activeMode,
  setActiveMode,
  activeGameRule: propActiveGameRule,
  setActiveGameRule: propSetActiveGameRule,
  enabledModes,
  includeGameModes = true,
  includeGameRules = true,
}: GameModeSelectorProps) {
  const [internalGameRule, setInternalGameRule] = useState(
    GameRuleFlags.Standard
  );

  // Enrich enabledModes with non-standard variants
  if (enabledModes?.includes(GameMode.std)) {
    enabledModes.push(
      GameMode.relaxstd,
      GameMode.autopilotstd,
      GameMode.scorev2std
    );
  }

  if (enabledModes?.includes(GameMode.catch)) {
    enabledModes.push(GameMode.relaxcatch, GameMode.scorev2catch);
  }

  if (enabledModes?.includes(GameMode.taiko)) {
    enabledModes.push(
      GameMode.relaxtaiko,
      GameMode.scorev2taiko,
      GameMode.autopilotstd
    );
  }

  if (enabledModes?.includes(GameMode.mania)) {
    enabledModes.push(GameMode.scorev2mania);
  }

  const activeGameRule = propActiveGameRule ?? internalGameRule;
  const setActiveGameRule = propSetActiveGameRule ?? setInternalGameRule;

  useEffect(() => {
    setActiveMode(AllowedGameModes[activeGameRule]["osu!"]!);
  }, [activeGameRule]);

  return (
    <div
      className={`flex place-content-between ${
        includeGameModes && includeGameRules ? " w-full" : ""
      }`}
    >
      {includeGameRules && (
        <div className="flex space-x-2">
          {Object.entries(GameRuleFlags).map(([mode, key]) => (
            <PrettyButton
              text={mode}
              key={mode}
              className="px-3 py-1"
              isSelected={activeGameRule === key}
              onClick={() => setActiveGameRule(key)}
            />
          ))}
        </div>
      )}

      {includeGameModes && (
        <div className="flex space-x-2">
          {Object.entries(AllowedGameModes[activeGameRule]).map(
            ([mode, key]) => (
              <PrettyButton
                text={mode}
                key={mode}
                className="px-3 py-1"
                isSelected={activeMode === key}
                onClick={() => setActiveMode(key!)}
                disabled={
                  key === null || (enabledModes && !enabledModes.includes(key))
                }
              />
            )
          )}
        </div>
      )}
    </div>
  );
}
