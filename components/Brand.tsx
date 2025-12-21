"use client";

import { useT } from "@/lib/i18n/utils";

export function Brand() {
  const t = useT("general.serverTitle.split");
  return (
    <h1 className="text-4xl font-semibold smooth-transition pb-1 cursor-pointer flex flex-row">
      <span className="text-primary dark">{t("part1")}</span>
      <span className="text-current">{t("part2")}</span>
    </h1>
  );
}
