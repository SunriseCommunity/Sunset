"use client";

import { Combobox } from "@/components/ComboBox";
import { useT } from "@/lib/i18n/utils";
import { useMemo } from "react";

export type UsersListSortingType = "username" | "lastActive";

interface UsersListSortingOptionsProps {
  sortBy: UsersListSortingType;
  onSortChange: (sort: UsersListSortingType) => void;
}

export function UsersListSortingOptions({
  sortBy,
  onSortChange,
}: UsersListSortingOptionsProps) {
  const t = useT("pages.friends.sorting");

  const values = useMemo(
    () => [
      {
        label: t("username"),
        value: "username" as const,
      },
      {
        label: t("recentlyActive"),
        value: "lastActive" as const,
      },
    ],
    [t]
  );

  return (
    <Combobox
      activeValue={sortBy}
      buttonPreLabel={t("label") + " "}
      setActiveValue={(v: any) => {
        onSortChange(v);
      }}
      values={values}
    />
  );
}
