"use client";
import { useEffect, useRef, useState } from "react";
import HeaderLink from "@/components/Header/HeaderLink";
import HeaderAccount from "@/components/Header/HeaderAccount";
import { twMerge } from "tailwind-merge";
import { ThemeModeToggle } from "@/components/Header/ThemeModeToggle";
import HeaderSearchCommand from "@/components/Header/HeaderSearchCommand";

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
          <span className="flex items-center space-x-6 text-sm font-medium">
            <HeaderLink name="leaderboard" />
            <HeaderLink name="top plays" />
            <HeaderLink name="wiki" />
          </span>
        </div>
        <div className="flex items-center space-x-6">
          <HeaderSearchCommand />
          <ThemeModeToggle />

          <HeaderAccount />
         
        </div>
      </div>
    </header>
  );
}
