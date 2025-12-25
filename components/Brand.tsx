"use client";

import { useT } from "@/lib/i18n/utils";

export function Brand() {
  const t = useT("general.serverTitle.split");
  return (
    <h1 className="smooth-transition flex cursor-pointer flex-row pb-1 text-4xl font-semibold">
      <span className="dark text-primary">{t("part1")}</span>
      <span className="text-current">{t("part2")}</span>
    </h1>
  );
}
