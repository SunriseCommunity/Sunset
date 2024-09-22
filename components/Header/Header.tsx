"use client";
import { useEffect, useState } from "react";
import HeaderLink from "@/components/Header/HeaderLink";
import HeaderAccount from "@/components/Header/HeaderAccount";
import { twMerge } from "tailwind-merge";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
      setIsHovered(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => !scrolled && setIsHovered(false);

  const className = `bg-gradient-to-t from-stone-800 bg-pos-0 bg-size-1000 ${
    scrolled ? `bg-pos-100 bg-size-200` : `hover:bg-pos-100 hover:bg-size-200`
  }`;

  return (
    <header className="sticky top-0 z-50 bg-transparent backdrop-blur-xl">
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={twMerge(
          `left-0 relative right-0 top-0 z-50 flex items-center border-b-2 border-white justify-between row-padding py-2 smooth-transition backdrop-blur-xl `,
          className
        )}
      >
        <div className="flex items-center space-x-6">
          {/* Brand */}
          <a href="/" className="smooth-transition">
            <h1 className="text-4xl font-semibold text-white smooth-transition pb-1 cursor-pointer flex flex-row">
              <p className="text-orange-400">sun</p>
              rise
            </h1>
          </a>

          {/* Links */}
          <span className="flex items-center space-x-6 text-sm font-medium">
            <HeaderLink name="leaderboard" isHovered={hovered} />
            <HeaderLink name="top plays" isHovered={hovered} />
            <HeaderLink name="wiki" isHovered={hovered} />
          </span>
        </div>
        <div className="flex items-center space-x-6">
          <HeaderAccount
            isHovered={hovered}
          />
        </div>
      </div>
    </header>
  );
}
