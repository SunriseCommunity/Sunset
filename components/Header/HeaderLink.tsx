"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface Props {
  name: string;
  href?: string;
}

export default function HeaderLink({ name, href }: Props) {
  const pathname = usePathname();
  const isActive = pathname === href;

  const Wrapper = href ? Link : React.Fragment;
  const wrapperProps = href ? { href: href } : {};

  return (
    <div
      aria-label={name}
      className="relative px-2 py-1 text-current/30 smooth-transition cursor-pointer hover:text-current opacity-40 group-hover:opacity-100"
    >
      {/* @ts-ignore */}
      <Wrapper {...wrapperProps}>
        <p
          className={`text-base ${
            isActive ? "text-current font-bold" : ""
          } hover:bg-neutral-600 hover:bg-opacity-25 p-1 rounded-md smooth-transition`}
        >
          {name}

          {/* Active indicator */}
          <span
            className={`absolute mt-0.5 h-[3px] w-[calc(100%-16px)] smooth-transition ${
              isActive ? "bg-current group-hover:bg-primary" : ""
            } inline-block rounded-3xl top-full right-2 ${
              isActive ? "opacity-100" : "opacity-40"
            }`}
          />
        </p>
      </Wrapper>
    </div>
  );
}
