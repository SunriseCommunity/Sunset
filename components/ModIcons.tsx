// Bitset information referenced from the osu-web repository
// https://github.com/ppy/osu-web/blob/master/app/Singletons/Mods.php

import { twMerge } from "tailwind-merge";

import { Tooltip } from "@/components/Tooltip";

const LEGACY_BITSET = [
  [1 << 0, "NF"],
  [1 << 1, "EZ"],
  [1 << 2, "TD"],
  [1 << 3, "HD"],
  [1 << 4, "HR"],
  [1 << 5, "SD"],
  [1 << 6, "DT"],
  [1 << 7, "RX"],
  [1 << 8, "HT"],
  [1 << 9, "NC"],
  [1 << 10, "FL"],
  [1 << 12, "SO"],
  [1 << 13, "AP"],
  [1 << 14, "PF"],
  [1 << 20, "FI"],
  [1 << 21, "RD"],
  [1 << 29, "V2"],
  [1 << 30, "MR"],
  // mania keys (converts)
  [1 << 15, "4K"],
  [1 << 16, "5K"],
  [1 << 17, "6K"],
  [1 << 18, "7K"],
  [1 << 19, "8K"],
  [1 << 24, "9K"],
];

const modNames: Record<string, string> = {
  "NM": "No Mod",
  "NF": "No Fail",
  "EZ": "Easy",
  "TD": "Touch Device",
  "HD": "Hidden",
  "HR": "Hard Rock",
  "SD": "Sudden Death",
  "DT": "Double Time",
  "RX": "Relax",
  "HT": "Half Time",
  "NC": "Nightcore",
  "FL": "Flashlight",
  "SO": "Spun Out",
  "AP": "Autopilot",
  "PF": "Perfect",
  "FI": "Fade In",
  "RD": "Random",
  "V2": "Score V2",
  "MR": "Mirror",
  // mania keys
  "4K": "4 Keys",
  "5K": "5 Keys",
  "6K": "6 Keys",
  "7K": "7 Keys",
  "8K": "8 Keys",
  "9K": "9 Keys",
};

function acronymToName(modAcronym: string): string {
  const name = modNames[modAcronym];
  if (name !== undefined) {
    return name;
  }

  return modAcronym;
}

function formatModName(modAcronym: string): string {
  return modAcronym.replace(" ", "-").toLowerCase();
}

export function ModIcons({
  modsBitset,
}: {
  modsBitset: number;
}) {
  const activeMods: string[] = LEGACY_BITSET.filter(([bit]) => (modsBitset & (bit as number)) !== 0).map(([, name]) => name as string);

  return (
    <span className="flex flex-row justify-center space-x-1 md:justify-start">
      {activeMods.map(modName => (
        <ModElement key={modName} modAcronym={modName} />
      ))}
    </span>
  );
}

export function ModElement({ modAcronym, variant }: { modAcronym: string; variant?: "leaderboard" | "default" }) {
  const modName = acronymToName(modAcronym);
  const formattedName = formatModName(modName);

  return (
    <Tooltip content={modName} disabled={variant === "leaderboard"} className="text-base">
      <div
        className={twMerge(
          "center p-1 rounded-md",
          variant === "leaderboard" ? "" : "bg-secondary",
        )}
      >
        <div
          className={twMerge(
            "w-10 h-7 mask-center mask-no-repeat mask-contain bg-secondary-foreground m-0",
            variant === "leaderboard" ? "" : "bg-secondary-foreground",
          )}
          style={{
            WebkitMaskImage: `url(/images/mods/mod-${formattedName}.svg)`,
            maskImage: `url(/images/mods/mod-${formattedName}.svg)`,
            WebkitMaskSize: "contain",
          }}
          aria-label={modName}
        />
        <span className="text-sm">{modAcronym}</span>
      </div>
    </Tooltip>
  );
}
