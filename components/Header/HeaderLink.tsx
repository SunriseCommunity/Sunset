"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

interface Props {
  name: string;
  href?: string;
}

export default function HeaderLink({ name, href }: Props) {
  const pathname = usePathname();
  const isActive = pathname === href;

  const Wrapper = href ? Link : React.Fragment;
  const wrapperProps = href ? { href } : {};

  return (
    <div
      aria-label={name}
      className="text-current/30 smooth-transition relative cursor-pointer px-2 py-1 opacity-40 hover:text-current group-hover:opacity-100"
    >
      {/* @ts-expect-error -- We hangle props the same way as Wrapper object */}
      <Wrapper {...wrapperProps}>
        <p
          className={`text-base ${
            isActive ? "font-bold text-current" : ""
          } smooth-transition text-nowrap rounded-md p-1 hover:bg-neutral-600 hover:bg-opacity-25`}
        >
          {name}

          {/* Active indicator */}
          <span
            className={`smooth-transition absolute mt-0.5 h-[3px] w-[calc(100%-16px)] ${
              isActive ? "bg-current group-hover:bg-primary" : ""
            } right-2 top-full inline-block rounded-3xl ${
              isActive ? "opacity-100" : "opacity-40"
            }`}
          />
        </p>
      </Wrapper>
    </div>
  );
}
