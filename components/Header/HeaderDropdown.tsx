"use client";

import { useEffect, useRef } from "react";
import PrettyButton from "@/components/General/PrettyButton";
import { twMerge } from "tailwind-merge";
import { clearAuthCookies } from "@/lib/utils/clearAuthCookies";
import { User } from "@/lib/hooks/api/user/types";
import { useUserSelf } from "@/lib/hooks/api/user/useUser";
import { Button } from "@/components/ui/button";

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

  const { mutate } = useUserSelf();

  return (
    self && (
      <div
        className={twMerge(
          "absolute invisible opacity-0 right-0 mt-4 origin-top-right w-[150px] bg-card border smooth-transition shadow-black shadow-lg rounded-md",
          isOpen ? "visible opacity-100 translate-y-0" : "-translate-y-1/4"
        )}
        ref={dropdownRef}
      >
        <div className="flex items-first flex-col p-4">
          <Button
            onClick={navigateTo.bind(null, `/user/${self.user_id}`)}
            className="text-start p-1 mb-1"
            variant="secondary"
          >
            my profile
          </Button>

          <Button
            onClick={navigateTo.bind(null, `/friends`)}
            className="text-start p-1 mb-1"
            variant="secondary"
          >
            friends
          </Button>

          <Button
            onClick={navigateTo.bind(null, `/settings`)}
            className="text-start p-1 mb-1"
            variant="secondary"
          >
            settings
          </Button>

          <Button
            onClick={() => {
              clearAuthCookies();
              mutate(undefined);
            }}
            className="text-start p-1 mb-1"
            variant="secondary"
          >
            sign out
          </Button>
        </div>
      </div>
    )
  );
}
