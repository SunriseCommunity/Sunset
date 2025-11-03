// Bitset information referenced from the osu-web repository
// https://github.com/ppy/osu-web/blob/master/app/Singletons/Mods.php

import Image from "next/image";
import { Tooltip } from "@/components/Tooltip";

const LEGACY_BITSET = [
  [1 << 0, 'NF'],
  [1 << 1, 'EZ'],
  [1 << 2, 'TD'],
  [1 << 3, 'HD'],
  [1 << 4, 'HR'],
  [1 << 5, 'SD'],
  [1 << 6, 'DT'],
  [1 << 7, 'RX'],
  [1 << 8, 'HT'],
  [1 << 9, 'NC'],
  [1 << 10, 'FL'],
  [1 << 12, 'SO'],
  [1 << 13, 'AP'],
  [1 << 14, 'PF'],
  [1 << 20, 'FI'],
  [1 << 21, 'RD'],
  [1 << 29, 'V2'],
  [1 << 30, 'MR'],
  // mania keys (converts)
  [1 << 15, '4K'],
  [1 << 16, '5K'],
  [1 << 17, '6K'],
  [1 << 18, '7K'],
  [1 << 19, '8K'],
  [1 << 24, '9K'],
];

const modNames: Record<string, string> = {
  'NF': 'No Fail',
  'EZ': 'Easy',
  'TD': 'Touch Device',
  'HD': 'Hidden',
  'HR': 'Hard Rock',
  'SD': 'Sudden Death',
  'DT': 'Double Time',
  'RX': 'Relax',
  'HT': 'Half Time',
  'NC': 'Nightcore',
  'FL': 'Flashlight',
  'SO': 'Spun Out',
  'AP': 'Auto Pilot',
  'PF': 'Perfect',
  'FI': 'Fade In',
  'RD': 'Random',
  'V2': 'Score V2',
  'MR': 'Mirror',
  // mania keys
  '4K': '4 Keys',
  '5K': '5 Keys',
  '6K': '6 Keys',
  '7K': '7 Keys',
  '8K': '8 Keys',
  '9K': '9 Keys',
};

const LEGACY_PREFERENCE_MODS_BITSET = 0b01000000000000000100001000100000;

function acronymToName(modAcronym: string): string {
  let name = modNames[modAcronym];
  if (name !== undefined) {
    return name
  }

  return modAcronym;
}

function formatModName(modAcronym: string): string {
  return modAcronym.replace(' ', '-').toLowerCase();
}

export function ModIcons({
  modsBitset,
}: {
  modsBitset: number;
}) {
  const activeMods: string[] = LEGACY_BITSET.filter(([bit]) => (modsBitset & (bit as number)) !== 0).map(([, name]) => name as string);

  return (
    <span className="flex flex-row space-x-1">
      {activeMods.map((modName) => (
        <ModElement key={modName} modAcronym={modName} />
      ))}
    </span>
  );
}

function ModElement({ modAcronym }: { modAcronym: string }) {
  const modName = acronymToName(modAcronym);
  const formattedName = formatModName(modName);

  return (
    <Tooltip content={modName} className="text-base">
      <Image
        src={`/images/mods/mod-${formattedName}.svg`}
        alt={modName}
        width={50}
        height={50}
        className={`center bg-secondary p-1 rounded-md`}
      />
    </Tooltip>
  );
}
