"use client";

import { getSelf } from "@/lib/actions/getSelf";
import { User } from "@/lib/types/User";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Spinner from "@/components/Spinner";
import HeaderLoginDropdown from "@/components/Header/HeaderLoginDropdown";
import HeaderDropdown from "@/components/Header/HeaderDropdown";

interface Props {
  dropdownMenuRef: React.RefObject<HTMLElement>;
  isHovered: boolean;
}

export default function HeaderAccount({ dropdownMenuRef, isHovered }: Props) {
  const [self, setSelf] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);

  useEffect(() => {
    getSelf().then((res) => {
      setSelf(res);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) return <Spinner />;

  return (
    <>
      {self ? (
        <div className="flex items-center space-x-4">
          <a
            href={`/user/${self.user_id}`}
            className="flex items-center space-x-2"
          >
            <Image
              src={`https://a.${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/${self.user_id}`}
              width={50}
              height={50}
              alt="Avatar"
              className="rounded-full cursor-pointer smooth-transition hover:scale-110"
            />
          </a>
          <Image
            src="/icons/dots-horizontal.svg"
            alt="Settings"
            width={24}
            height={24}
            className={`dark:invert hover:bg-neutral-600 rounded-md smooth-transition ${
              !isHovered ? "opacity-40" : ""
            }`}
            onClick={() => setIsUserDropdownOpen((prev) => !prev)}
          />
        </div>
      ) : (
        <div>
          <button
            onClick={() => setIsLoginDropdownOpen((prev) => !prev)}
            className={`hover:bg-zinc-600 p-1 rounded-md smooth-transition ${
              !isHovered ? "opacity-40" : ""
            }`}
          >
            sign in
          </button>
        </div>
      )}
      <HeaderLoginDropdown
        setSelf={setSelf}
        dropdownMenuRef={dropdownMenuRef}
        isOpen={isLoginDropdownOpen}
        setIsOpen={setIsLoginDropdownOpen}
      />
      <HeaderDropdown
        dropdownMenuRef={dropdownMenuRef}
        self={self}
        isOpen={isUserDropdownOpen}
        setIsOpen={setIsUserDropdownOpen}
      />
    </>
  );
}
