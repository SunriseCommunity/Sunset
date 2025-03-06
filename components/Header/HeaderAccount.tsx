"use client";

import { useState } from "react";
import Image from "next/image";
import Spinner from "@/components/Spinner";
import HeaderLoginDropdown from "@/components/Header/HeaderLoginDropdown";
import HeaderDropdown from "@/components/Header/HeaderDropdown";
import useSelf from "@/lib/hooks/useSelf";
import { LucideMoreHorizontal } from "lucide-react";

interface Props {
  isHovered: boolean;
}

export default function HeaderAccount({ isHovered }: Props) {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);

  const { self, isLoading } = useSelf();

  if (isLoading) return <Spinner />;

  return (
    <>
      {self ? (
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Image
              src={`https://a.${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/${
                self.user_id
              }?${Date.now()}`}
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
            className={`hover:bg-zinc-600 p-1 rounded-md smooth-transition ${
              !isHovered ? "opacity-40" : ""
            }`}
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
