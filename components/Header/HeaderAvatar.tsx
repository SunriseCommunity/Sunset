"use client";

import useSelf from "@/lib/hooks/useSelf";
import HeaderUserDropdown from "@/components/Header/HeaderUserDropdown";
import HeaderLoginDialog from "@/components/Header/HeaderLoginDialog";

export default function HeaderAvatar() {
  const { self } = useSelf();

  return self ? (
    <HeaderUserDropdown self={self} />
  ) : (
    <HeaderLoginDialog />
  );
}
