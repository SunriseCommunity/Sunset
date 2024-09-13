"use client";

import { User } from "@/lib/types/User";
import { useEffect, useRef } from "react";
import Cookies from "js-cookie";

interface Props {
  dropdownMenuRef: React.RefObject<HTMLElement>;
  self: User | null;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function HeaderDropdown({
  dropdownMenuRef,
  isOpen,
  self,
  setIsOpen,
}: Props) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    updateVisibilityOfDropdown();

    document.addEventListener("click", closeDropdown);
    return () => document.removeEventListener("click", closeDropdown);
  }, [isOpen]);

  const updateVisibilityOfDropdown = () => {
    if (!dropdownRef.current) return;
    const dropdown = dropdownRef.current;

    if (isOpen) {
      dropdown.classList.remove("hidden", "opacity-0");
      updateDropdownParent();
      dropdown.classList.add("absolute", "opacity-100");
    } else {
      dropdown.classList.remove("opacity-100");
      dropdown.classList.add("opacity-0");
      setTimeout(() => {
        dropdown.classList.add("hidden");
        dropdown.classList.remove("absolute");
        updateDropdownParent();
      }, 200);
    }
  };

  const updateDropdownParent = () => {
    if (!dropdownRef.current) return;
    const dropdown = dropdownRef.current;

    if (dropdownMenuRef.current?.contains(dropdown)) {
      dropdownMenuRef.current?.removeChild(dropdown);
    } else {
      dropdownMenuRef.current?.appendChild(dropdown);
    }
  };

  const closeDropdown = (e: MouseEvent) => {
    if (
      !dropdownRef.current ||
      (dropdownRef.current as HTMLElement).contains(e.target as Node)
    )
      return;

    setIsOpen(false);
  };

  const navigateTo = (href: string) => {
    window.location.href = href;
  };

  const clearCookies = () => {
    Cookies.remove("session_token");
    Cookies.remove("refresh_token");
    window.location.href = "/";
  };

  return (
    self && (
      <div
        className="hidden bg-stone-800 p-4 space-y-4 smooth-transition opacity-0 ml-auto"
        ref={dropdownRef}
      >
        <div className="flex items-first flex-col min-w-[150px]">
          <button
            className="hover:bg-zinc-600 p-1 rounded-md smooth-transition text-start"
            onClick={navigateTo.bind(null, `/user/${self.user_id}`)}
          >
            my profile
          </button>
          <button
            className="hover:bg-zinc-600 p-1 rounded-md smooth-transition text-start"
            onClick={navigateTo.bind(null, `/settings`)}
          >
            settings
          </button>
          <button
            className="hover:bg-zinc-600 p-1 rounded-md smooth-transition text-start"
            onClick={clearCookies}
          >
            sign out
          </button>
        </div>
      </div>
    )
  );
}
