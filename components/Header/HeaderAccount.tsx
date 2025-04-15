"use client";

import { useState } from "react";
import Image from "next/image";
import HeaderLoginDropdown from "@/components/Header/HeaderLoginDropdown";
import HeaderDropdown from "@/components/Header/HeaderDropdown";
import useSelf from "@/lib/hooks/useSelf";

export default function HeaderAccount() {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);

  const { self } = useSelf();

  return (
    <>
      {self ? (
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Image
              src={self.avatar_url}
              width={50}
              height={50}
              alt="Avatar"
              className="rounded-full cursor-pointer smooth-transition hover:scale-110"
              onClick={() => setIsUserDropdownOpen((prev) => !prev)}
            />

            <HeaderDropdown
              self={self}
              isOpen={isUserDropdownOpen}
              setIsOpen={setIsUserDropdownOpen}
            />
          </div>
        </div>
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
