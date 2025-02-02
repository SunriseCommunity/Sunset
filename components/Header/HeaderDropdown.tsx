"use client";

import { User } from "@/lib/types/User";
import { useEffect, useRef } from "react";
import PrettyButton from "@/components/General/PrettyButton";
import { twMerge } from "tailwind-merge";
import { clearAuthCookies } from "@/lib/utils/clearAuthCookies";

interface Props {
  self: User | null;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function HeaderDropdown({ isOpen, self, setIsOpen }: Props) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.addEventListener("click", closeDropdown);
    return () => document.removeEventListener("click", closeDropdown);
  }, [isOpen]);

  const closeDropdown = (e: MouseEvent) => {
    if ((dropdownRef.current as HTMLElement)?.contains(e.target as Node))
      return;

    setIsOpen(false);
  };

  const navigateTo = (href: string) => {
    window.location.href = href;
  };

  return (
    self && (
      <div
        className={twMerge(
          "absolute invisible opacity-0 right-0 mt-4 origin-top-right w-[150px] bg-stone-800 smooth-transition shadow-black shadow-lg rounded-md",
          isOpen ? "visible opacity-100 translate-y-0" : "-translate-y-1/4"
        )}
        ref={dropdownRef}
      >
        <div className="flex items-first flex-col p-4">
          <PrettyButton
            onClick={navigateTo.bind(null, `/user/${self.user_id}`)}
            text="my profile"
            className="text-start p-1 mb-1"
          />

          <PrettyButton
            onClick={navigateTo.bind(null, `/settings`)}
            text="settings"
            className="text-start p-1 mb-1"
          />

          <PrettyButton
            onClick={clearAuthCookies}
            text="sign out"
            className="text-start p-1 mb-1"
          />
        </div>
      </div>
    )
  );
}
