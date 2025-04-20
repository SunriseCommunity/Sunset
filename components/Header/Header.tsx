"use client";
import { useEffect, useState } from "react";
import HeaderLink from "@/components/Header/HeaderLink";

import { twMerge } from "tailwind-merge";
import { ThemeModeToggle } from "@/components/Header/ThemeModeToggle";
import HeaderSearchCommand from "@/components/Header/HeaderSearchCommand";
import HeaderMobileDrawer from "@/components/Header/HeaderMobileDrawer";
import HeaderAvatar from "@/components/Header/HeaderAvatar";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const className = `bg-gradient-to-t from-secondary bg-pos-0 bg-size-1000 ${
    scrolled ? `bg-pos-100 bg-size-200` : `hover:bg-pos-100 hover:bg-size-200`
  }`;

  return (
    <header className="sticky top-0 z-50 bg-transparent backdrop-blur-xl">
      <div
        className={twMerge(
          `left-0 group relative right-0 top-0 z-50 hove flex items-center border-b-2 border-current justify-between row-padding py-2 smooth-transition backdrop-blur-xl `,
          className
        )}
      >
        <div className="flex items-center space-x-6">
          {/* Brand */}
          <a href="/" className="smooth-transition">
            <h1 className="text-4xl font-semibold smooth-transition pb-1 cursor-pointer flex flex-row">
              <span className="text-primary dark">sun</span>
              <span className="text-current">rise</span>
            </h1>
          </a>

          {/* Links */}
          <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <HeaderLink name="leaderboard" href="/leaderboard" />
            <HeaderLink name="top plays" href="/topplays" />

            <DropdownMenu>
              <DropdownMenuTrigger className="focus-visible:outline-none">
                <HeaderLink name="help" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuGroup className="space-y-2 p-2">
                  <DropdownMenuItem asChild>
                    <Link href={`/wiki`}>wiki</Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link
                      href={`https://api.${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/docs`}
                    >
                      api docs
                    </Link>
                  </DropdownMenuItem>

                  {process.env.NEXT_PUBLIC_DISCORD_LINK && (
                    <DropdownMenuItem asChild>
                      <Link href={process.env.NEXT_PUBLIC_DISCORD_LINK}>
                        discord server
                      </Link>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <HeaderSearchCommand />
          <ThemeModeToggle />
          <HeaderAvatar />
        </div>

        <div className="flex md:hidden space-x-6">
          <HeaderMobileDrawer />
        </div>
      </div>
    </header>
  );
}
