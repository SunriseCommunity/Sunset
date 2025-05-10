"use client";

import { Combobox } from "@/components/ComboBox";

export type UsersListSortingType = "username" | "lastActive";

interface UsersListSortingOptionsProps {
  sortBy: UsersListSortingType;
  onSortChange: (sort: UsersListSortingType) => void;
}

export function UsersListSortingOptions({
  sortBy,
  onSortChange,
}: UsersListSortingOptionsProps) {
  return (
    <Combobox
      activeValue={sortBy}
      buttonPreLabel="Sort by: "
      setActiveValue={(v: any) => {
        onSortChange(v);
      }}
      values={[
        {
          label: "Username",
          value: "username",
        },
        {
          label: "Recently active",
          value: "lastActive",
        },
      ]}
    />
  );
}
