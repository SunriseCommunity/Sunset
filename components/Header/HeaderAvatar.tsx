"use client";

import { useState } from "react";
import HeaderLoginDropdown from "@/components/Header/HeaderLoginDropdown";

import useSelf from "@/lib/hooks/useSelf";
import HeaderUserDropdown from "@/components/Header/HeaderUserDropdown";

export default function HeaderAvatar() {
  const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);

  const { self } = useSelf();

  return (
    <>
      {self ? (
        <HeaderUserDropdown self={self} />
      ) : (
        <div className="relative">
          <button
            onClick={() => setIsLoginDropdownOpen((prev) => !prev)}
            className="hover:bg-zinc-600 p-1 rounded-md smooth-transition opacity-40 group-hover:opacity-100"
          >
            sign in
          </button>
          <HeaderLoginDropdown
            isOpen={isLoginDropdownOpen}
            setIsOpen={setIsLoginDropdownOpen}
          />
        </div>
      )}
    </>
  );
}
